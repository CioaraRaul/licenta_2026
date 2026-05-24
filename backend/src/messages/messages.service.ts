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

    // Conversațiile sunt peer-to-peer: una singură per buyer↔seller, indiferent de vehicul.
    // vehicleId se actualizează la cel mai recent vehicul discutat.
    let conversation = await this.conversationRepo.findOne({
      where: { buyerId, sellerId },
    });

    if (!conversation) {
      conversation = this.conversationRepo.create({
        buyerId,
        sellerId,
        vehicleId,
        lastMessage: content,
        lastMessageAt: new Date(),
        lastMessageSenderId: senderId,
        unreadByBuyer: 0,
        unreadBySeller: 1,
      });
      await this.conversationRepo.save(conversation);
    } else {
      conversation.vehicleId = vehicleId;
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      conversation.lastMessageSenderId = senderId;
      conversation.unreadBySeller += 1;
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
    conversation.lastMessageSenderId = senderId;
    if (senderId === conversation.buyerId) {
      conversation.unreadBySeller += 1;
    } else {
      conversation.unreadByBuyer += 1;
    }
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
    const conversations = await this.conversationRepo
      .createQueryBuilder('conv')
      .leftJoinAndSelect('conv.vehicle', 'vehicle')
      .leftJoinAndSelect('conv.buyer', 'buyer')
      .leftJoinAndSelect('conv.seller', 'seller')
      .where('conv.buyerId = :userId OR conv.sellerId = :userId', { userId })
      .orderBy('conv.lastMessageAt', 'DESC')
      .getMany();

    // Setăm câmpurile virtuale per utilizator
    for (const conv of conversations) {
      conv.unreadCount =
        conv.buyerId === userId ? conv.unreadByBuyer : conv.unreadBySeller;
      conv.aliasForOther =
        conv.buyerId === userId ? conv.aliasByBuyer : conv.aliasBySeller;
    }

    return conversations;
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

    // Resetăm unreadCount doar pentru cel care citește
    if (conversation.buyerId === userId) {
      await this.conversationRepo.update(conversationId, { unreadByBuyer: 0 });
    } else {
      await this.conversationRepo.update(conversationId, { unreadBySeller: 0 });
    }

    const [data, total] = await this.messageRepo.findAndCount({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  // ─── Edit Message ──────────────────────────────────────────────────────────

  async editMessage(
    userId: number,
    messageId: number,
    content: string,
  ): Promise<Message> {
    if (!content?.trim())
      throw new BadRequestException('Message content cannot be empty');

    const message = await this.messageRepo.findOne({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Message not found');

    if (message.senderId !== userId)
      throw new ForbiddenException('You can only edit your own messages');

    message.content = content;
    const saved = await this.messageRepo.save(message);

    // Dacă era ultimul mesaj din conversație, actualizăm preview-ul
    const last = await this.messageRepo.findOne({
      where: { conversationId: message.conversationId },
      order: { createdAt: 'DESC' },
    });
    if (last && last.id === message.id) {
      await this.conversationRepo.update(message.conversationId, {
        lastMessage: content,
      });
    }

    return saved;
  }

  // ─── Delete Message ────────────────────────────────────────────────────────

  async deleteMessage(userId: number, messageId: number): Promise<void> {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Message not found');

    if (message.senderId !== userId)
      throw new ForbiddenException('You can only delete your own messages');

    const conversationId = message.conversationId;
    await this.messageRepo.remove(message);

    // Recalculează preview-ul conversației
    const last = await this.messageRepo.findOne({
      where: { conversationId },
      order: { createdAt: 'DESC' },
    });
    await this.conversationRepo.update(conversationId, {
      lastMessage: last ? last.content : null,
      lastMessageAt: last ? last.createdAt : null,
      lastMessageSenderId: last ? last.senderId : null,
    });
  }

  // ─── Delete Conversation ───────────────────────────────────────────────────

  async deleteConversation(
    userId: number,
    conversationId: number,
  ): Promise<void> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.buyerId !== userId && conversation.sellerId !== userId)
      throw new ForbiddenException('Access denied');

    // Mesajele cad prin CASCADE pe conversationId
    await this.conversationRepo.remove(conversation);
  }

  // ─── Set Alias (rename other participant from current user perspective) ────

  async setAlias(
    userId: number,
    conversationId: number,
    alias: string | null,
  ): Promise<Conversation> {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.buyerId !== userId && conversation.sellerId !== userId)
      throw new ForbiddenException('Access denied');

    const trimmed = alias?.trim() || null;

    if (conversation.buyerId === userId) {
      conversation.aliasByBuyer = trimmed;
    } else {
      conversation.aliasBySeller = trimmed;
    }
    return this.conversationRepo.save(conversation);
  }
}
