import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/users/auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // ─── Send first message (creează conversația automat) ─────────────────────

  @Post('vehicle/:vehicleId')
  @UseGuards(JwtAuthGuard)
  sendMessage(
    @Request() req,
    @Param('vehicleId', ParseIntPipe) vehicleId: number,
    @Body('content') content: string,
  ) {
    return this.messagesService.sendMessage(
      req.user.userId,
      vehicleId,
      content,
    );
  }

  // ─── Reply în conversație existentă ───────────────────────────────────────

  @Post(':conversationId/reply')
  @UseGuards(JwtAuthGuard)
  reply(
    @Request() req,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body('content') content: string,
  ) {
    return this.messagesService.replyInConversation(
      req.user.userId,
      conversationId,
      content,
    );
  }

  // ─── Get my conversations ──────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyConversations(@Request() req) {
    return this.messagesService.getMyConversations(req.user.userId);
  }

  // ─── Get messages in conversation ─────────────────────────────────────────

  @Get(':conversationId')
  @UseGuards(JwtAuthGuard)
  getMessages(
    @Request() req,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.messagesService.getMessages(
      req.user.userId,
      conversationId,
      page,
      limit,
    );
  }
}
