
import { useChatStore } from '@/store/modules/chat'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: number, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: number, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Chat) => {
    chatStore.updateChatByUuid(uuid, index, chat)
  }
  const updateChatById = (uuid: number, id: string, chat:  Partial<Chat.Chat>) => {
    chatStore.updateChatById(uuid, id, chat)
  }
  const updateChatSome = (uuid: number, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }
  return {
    addChat,
    updateChat,
    updateChatById,
    updateChatSome,
    getChatByUuidAndIndex,
  }
}
