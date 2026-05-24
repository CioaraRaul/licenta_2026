import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
  HttpCode,
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

  // ─── Edit own message ──────────────────────────────────────────────────────

  @Patch('message/:messageId')
  @UseGuards(JwtAuthGuard)
  editMessage(
    @Request() req,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body('content') content: string,
  ) {
    return this.messagesService.editMessage(
      req.user.userId,
      messageId,
      content,
    );
  }

  // ─── Delete own message ────────────────────────────────────────────────────

  @Delete('message/:messageId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  deleteMessage(
    @Request() req,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.messagesService.deleteMessage(req.user.userId, messageId);
  }

  // ─── Delete entire conversation ────────────────────────────────────────────

  @Delete('conversation/:conversationId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  deleteConversation(
    @Request() req,
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ) {
    return this.messagesService.deleteConversation(
      req.user.userId,
      conversationId,
    );
  }

  // ─── Set alias for the other participant ───────────────────────────────────

  @Patch('conversation/:conversationId/alias')
  @UseGuards(JwtAuthGuard)
  setAlias(
    @Request() req,
    @Param('conversationId', ParseIntPipe) conversationId: number,
    @Body('alias') alias: string | null,
  ) {
    return this.messagesService.setAlias(
      req.user.userId,
      conversationId,
      alias,
    );
  }
}
