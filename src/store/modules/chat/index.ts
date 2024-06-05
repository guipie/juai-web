import { defineStore } from 'pinia'
import { defaultState, getLocalState, setLocalState } from './shared'
import { router } from '@/router'
import { SetupStoreId } from '@/enum';
import { useAppStore } from '../app';
import { useAICommonStore } from '@/store/modules/aicommon';
import { useTabStore } from '../tab';
export const useChatStore = defineStore(SetupStoreId.Chat, {
  state: (): Chat.ChatState => getLocalState(),
  getters: {
  },

  actions: {
    getCurrentOptions(uuid: number) {
      var curChat = this.conversations.findLast(item => item.uuid == uuid);
      if (!curChat || !curChat.model.id || !curChat.model.url) {
        window.$message?.error("当前会话已无效，请新建会话");
        throw new Error("无效聊天");
      }
      return {
        // model: curChat.model.modelId.split(":")[1],
        url: curChat.model.url,
        rolePrompt: curChat.chatPrompt,
        maxContext: curChat.maxContext
      };
    },
    async chatInit() {
      useAppStore().handReloadFlag = false;
    },
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      this.recordState()
    },
    setUsingAsyncDb(async: boolean) {
      this.usingAsyncDb = async
      this.recordState()
    },
    getConversationByUuid(uuid: number) {
      return this.conversations.findLast(m => m.uuid == uuid)!;
    },
    addConversation(uuid: number, name?: string, maxContext?: number, chatPrompt?: JuAI.ChatPrompt, isShare?: boolean) {
      if (this.conversations.findIndex(m => m.uuid == uuid) > -1) return;
      this.conversations.unshift({
        uuid: uuid,
        name: name ?? "新会话",
        model: useAICommonStore().getModelByModelName(chatPrompt?.model)!,
        isEdit: false,
        maxContext: maxContext ?? 3,
        data: [],
        chatPrompt: chatPrompt,
        isShare: isShare ?? false
      })
      this.reloadRoute(uuid);
      this.recordState();
    },
    updateConversationByUuid(uuid: number, conversation: Partial<Chat.Conversation>) {
      var index = this.conversations.findIndex(m => m.uuid == uuid)!;
      this.conversations[index] = { ...this.conversations[index], ...conversation };
      this.recordState();
    },
    async deleteConversation(uuid: number) {
      this.conversations.splice(this.conversations.findIndex(m => m.uuid == uuid), 1)
      this.reloadRoute()
    },
    async deleteChatByUuid(uuid: number, index: number) {
      this.conversations.findLast(m => m.uuid == uuid)!.data.splice(index, 1)
    },
    getChatDataByUuid(uuid: number) {
      return this.conversations.findLast(m => m.uuid == uuid)?.data ?? [];
    },
    getChatByUuid(uuid: number, chatId: string) {
      return this.conversations.findLast(m => m.uuid == uuid)!.data.findLast(m => m.id == chatId);
    },
    addChatByUuid(uuid: number, chat: Chat.Chat) {
      this.conversations.findLast(m => m.uuid == uuid)!.data.push(chat)
      this.recordState();
    },
    updateChatByUuid(uuid: number, chat: Partial<Chat.Chat>) {
      var conversation = this.conversations.findLast(m => m.uuid == uuid)!;
      const index = conversation.data.findIndex(m => m.id == chat.id);
      if (index > -1) {
        conversation.data[index] = { ...conversation.data[index], ...chat };
      }
      this.recordState();
    },
    updateChatByIndex(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      var conversation = this.conversations.findLast(m => m.uuid == uuid)!;
      conversation.data[index] = { ...conversation.data[index], ...chat };
      this.recordState();
    },
    clearConversations() {
      this.$state = { ...defaultState() }
      this.recordState()
    },
    curChatModelChange(uuid: number, modelName: string) {
      var model = useAICommonStore().getModelByModelName(modelName)!;
      var curChat = this.conversations.findLast(m => m.uuid == uuid);
      curChat!.model = model;
      this.recordState();
    },
    curMaxContextChange(uuid: number, maxContext: number) {
      var curChat = this.conversations.findLast(m => m.uuid == uuid);
      curChat!.maxContext = maxContext;
      this.recordState();
    },
    async reloadRoute(uuid?: number) {
      this.recordState();
      if (!uuid || uuid <= 0 || this.conversations.length == 0) {
        if (this.conversations.length == 0) {
          this.addConversation(Date.now());
        }
        await router.push('chat?uuid=' + this.conversations[0].uuid);
        return;
      }
      var index = this.conversations.findIndex(m => m.uuid == uuid);
      if (index == -1)
        await router.push('chat?uuid=' + this.conversations[0].uuid);
      else
        await router.push('chat?uuid=' + uuid);
      // useTabStore().updateTabByActive({
      //   fullPath: router.currentRoute.value.fullPath,
      // });
      console.log("会话跳转：", uuid, useTabStore().tabs);
    },

    recordState() {
      setLocalState(this.$state)
    }
  },
})
