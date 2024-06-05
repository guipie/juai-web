
import { useChatStore } from '@/store/modules/chat'

export function useChat() {
  const chatStore = useChatStore()

  // const getChatByUuidAndIndex = (uuid: number, index: number) => {
  //   return chatStore.getChatByUuidAndIndex(uuid, index)
  // }
  const addConversation = (uuid: number, name?: string, isShare?: boolean) => {
    chatStore.addConversation(uuid);
  }
  const addShareConversation = (uuid: number, name: string, maxContext: number, chatPrompt: JuAI.ChatPrompt) => {
    chatStore.addConversation(uuid, name, maxContext, chatPrompt, true);
  }
  const getChatByUuid = (uuid: number, chatId: string) => {
    return chatStore.getChatByUuid(uuid, chatId);
  }
  const addChat = (uuid: number, chat: Chat.Chat) => {
    const conversation = chatStore.conversations.findLast(m => m.uuid === uuid);
    if (!conversation || !conversation.model) {
      window.$message?.warning("当前会话已无效，请新建会话");
      throw new Error("无效会话" + uuid);
    }
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChatByIndex = (uuid: number, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatByIndex(uuid, index, chat)
  }
  const updateChatByUuid = (uuid: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatByUuid(uuid, chat)
  }
  return {
    addChat,
    updateChatByIndex,
    updateChatById: updateChatByUuid,
    getChatByUuid,
    addConversation,
    addShareConversation
  }
}
