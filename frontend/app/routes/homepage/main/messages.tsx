import { useLoaderData } from "react-router";
import { useAuthStore } from "~/store/auth.store";
import { getConversations } from "~/api/messages.api";
import MessagesComponent from "~/components/homepage/mainSectionComponent/messages";
import type { MessagesPageData } from "~/interface/message.interface";

/**
 * clientLoader — se execută pe client înainte de renderizarea paginii.
 * Preia lista de conversații a utilizatorului curent din API.
 * Returnează un obiect tipizat MessagesPageData cu conversații, userId și flag de eroare.
 */
export async function clientLoader(): Promise<MessagesPageData> {
  const user = useAuthStore.getState().user;

  if (!user) {
    return { conversations: [], currentUserId: 0, error: true };
  }

  try {
    const conversations = await getConversations();
    return {
      conversations,
      currentUserId: user.userId,
      error: false,
    };
  } catch {
    return {
      conversations: [],
      currentUserId: user.userId,
      error: true,
    };
  }
}

/**
 * Componenta rută — primește datele din clientLoader via useLoaderData
 * și le transmite componentei de prezentare MessagesComponent.
 * Logica de UI rămâne complet în componenta din /components.
 */
function Messages() {
  const data = useLoaderData<typeof clientLoader>();
  return <MessagesComponent {...data} />;
}

export default Messages;
