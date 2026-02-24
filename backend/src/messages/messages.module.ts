import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { Conversation } from './messages/entities/conversation.entity';
import { Message } from './messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, Message, Vehicle])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
