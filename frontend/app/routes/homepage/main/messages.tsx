import { useLoaderData } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { getConversations } from "~/api/messages.api";
import type { MessagesLayoutProps } from "~/interface/message.interface";
import MessagesLayout from "~/components/messages";

export async function clientLoader(): Promise<MessagesLayoutProps> {
  const user = useAuthStore.getState().user;

  if (!user) {
    return { conversations: [], currentUserId: 0, error: true };
  }

  try {
    const conversations = await getConversations();
    return {
      conversations,
      currentUserId: user.id,
      error: false,
    };
  } catch {
    return {
      conversations: [],
      currentUserId: user.id,
      error: true,
    };
  }
}

export default function Messages() {
  const data = useLoaderData<typeof clientLoader>();
  return <MessagesLayout {...data} />;
}
