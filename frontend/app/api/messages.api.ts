import { httpClient } from './http.api';
import type {
  Message,
  Conversation,
  SendMessagePayload,
} from '~/interface/message.interface';
import type { PaginatedResponse } from '~/interface/vehicle.interface';

/** POST /messages/vehicle/:vehicleId — pornește o conversație nouă cu seller-ul */
export async function startConversation(
  vehicleId: number,
  payload: SendMessagePayload,
): Promise<Message> {
  return httpClient.post<Message>(`/messages/vehicle/${vehicleId}`, payload);
}

/** POST /messages/:conversationId/reply — răspunde într-o conversație existentă */
export async function replyToConversation(
  conversationId: number,
  payload: SendMessagePayload,
): Promise<Message> {
  return httpClient.post<Message>(`/messages/${conversationId}/reply`, payload);
}

/** GET /messages — lista conversațiilor utilizatorului curent */
export async function getConversations(): Promise<Conversation[]> {
  return httpClient.get<Conversation[]>('/messages');
}

/** GET /messages/:conversationId — mesajele dintr-o conversație cu paginare */
export async function getConversationMessages(
  conversationId: number,
  page = 1,
  limit = 50,
): Promise<PaginatedResponse<Message>> {
  return httpClient.get<PaginatedResponse<Message>>(
    `/messages/${conversationId}`,
    { params: { page, limit } },
  );
}

/** PATCH /messages/message/:id — editează conținutul propriului mesaj */
export async function editMessage(
  messageId: number,
  content: string,
): Promise<Message> {
  return httpClient.patch<Message>(`/messages/message/${messageId}`, {
    content,
  });
}

/** DELETE /messages/message/:id — șterge propriul mesaj */
export async function deleteMessage(messageId: number): Promise<void> {
  return httpClient.delete<void>(`/messages/message/${messageId}`);
}

/** DELETE /messages/conversation/:id — șterge întreaga conversație */
export async function deleteConversation(conversationId: number): Promise<void> {
  return httpClient.delete<void>(`/messages/conversation/${conversationId}`);
}

/** PATCH /messages/conversation/:id/alias — setează un alias custom pentru celălalt participant */
export async function setConversationAlias(
  conversationId: number,
  alias: string | null,
): Promise<Conversation> {
  return httpClient.patch<Conversation>(
    `/messages/conversation/${conversationId}/alias`,
    { alias },
  );
}
