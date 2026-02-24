import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './messages/entities/conversation.entity';
import { Repository } from 'typeorm';
import { Message } from './messages/entities/message.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { MessageStatus } from './messages/enum/message-status.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async sendMessage(
    senderId: number,
    vehicleId: number,
    content: string,
  ): Promise<Message> {
    if (!content?.trim())
      throw new BadRequestException('Message content cannot be empty');

    const vehicle = await this.vehicleRepo.findOne({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    // Nu poți trimite mesaj ție însuți
    if (vehicle.sellerId === senderId)
      throw new BadRequestException('Cannot message yourself');

    const buyerId = senderId;
    const sellerId = vehicle.sellerId;

    // Găsim sau creăm conversația
    let conversation = await this.conversationRepo.findOne({
      where: { buyerId, sellerId, vehicleId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        buyerId,
        sellerId,
        vehicleId,
        lastMessage: content,
        lastMessageAt: new Date(),
        unreadCount: 1,
      });
      await this.conversationRepo.save(conversation);
    } else {
      // Actualizăm preview-ul conversației
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      conversation.unreadCount += 1;
      await this.conversationRepo.save(conversation);
    }

    const message = this.messageRepo.create({
      content,
      senderId,
      conversationId: conversation.id,
    });

    return this.messageRepo.save(message);
  }

  // ─── Reply in Conversation ─────────────────────────────────────────────────

  async replyInConversation(
    senderId: number,
    conversationId: number,
    content: string,
  ): Promise<Message> {
    if (!content?.trim())
      throw new BadRequestException('Message content cannot be empty');

    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    // Doar buyer-ul sau seller-ul pot răspunde
    if (conversation.buyerId !== senderId && conversation.sellerId !== senderId)
      throw new ForbiddenException('Access denied');

    conversation.lastMessage = content;
    conversation.lastMessageAt = new Date();
    conversation.unreadCount += 1;
    await this.conversationRepo.save(conversation);

    const message = this.messageRepo.create({
      content,
      senderId,
      conversationId,
    });

    return this.messageRepo.save(message);
  }

  // ─── Get My Conversations ──────────────────────────────────────────────────

  async getMyConversations(userId: number): Promise<Conversation[]> {
    return this.conversationRepo
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.vehicle', 'vehicle')
      .leftJoinAndSelect('conv.buyer', 'buyer')
      .leftJoinAndSelect('conv.seller', 'seller')
      .where('conv.buyerId = :userId OR conv.sellerId = :userId', { userId })
      .orderBy('conv.lastMessageAt', 'DESC')
      .getMany();
  }

  // ─── Get Messages in Conversation ─────────────────────────────────────────

  async getMessages(
    userId: number,
    conversationId: number,
    page: number,
    limit: number,
  ): Promise<{ data: Message[]; total: number }> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.buyerId !== userId && conversation.sellerId !== userId)
      throw new ForbiddenException('Access denied');

    // Marcăm mesajele ca citite
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ status: MessageStatus.READ })
      .where(
        'conversationId = :conversationId AND senderId != :userId AND status = :status',
        { conversationId, userId, status: MessageStatus.SENT },
      )
      .execute();

    // Resetăm unreadCount
    await this.conversationRepo.update(conversationId, { unreadCount: 0 });

    const [data, total] = await this.messageRepo.findAndCount({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
}
