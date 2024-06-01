import { defineStore } from 'pinia'
import { defaultState, getLocalState, setLocalState } from './shared'
import { router } from '@/router'
import { SetupStoreId } from '@/enum';
import { useAICommonStore } from '../aicommon';
import { useAppStore } from '../app';
import { useUsingContext } from '@/hooks/chat/useUsingContext';
export const useChatStore = defineStore(SetupStoreId.Chat, {
  state: (): Chat.ChatState => getLocalState(),
  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },
    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
    getIsPromptByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index].chatPrompt?.id && state.history[index].chatPrompt!.id! > 0;
      return false;
    },
  },

  actions: {
    getCurrentOptions(chatType: Chat.ChatType, model?: string) {
      const { usingContext, usingShareContext } = useUsingContext();
      let options: { model?: string, url?: string, rolePrompt?: string, usingContext: boolean } = { usingContext: chatType == 'share' ? usingShareContext.value : usingContext.value };
      if (chatType == 'chat' || chatType == 'share' || model) {
        const prompt = this.history.findLast(item => item.uuid === this.active)?.chatPrompt;
        if (prompt?.isGroup)
          options.model = model;
        else {
          options.model = prompt?.model ?? this.currentModel;
          options.rolePrompt = prompt?.prompt;
        }
      }
      else
        throw new Error("无效聊天");
      var queryModel = useAICommonStore().models.findLast(m => m.modelId.endsWith(options.model!));
      options.model = queryModel?.modelId.split(":")[1];
      options.url = queryModel?.url;
      if (!options.model) throw new Error("无效聊天");
      return options;
    },
    getModelByModelId(model: string) {
      let item = useAICommonStore().models.findLast(m => m.modelId.endsWith(model));
      return item;
    },
    async chatInit() {
      await useAICommonStore().getModels();
      useAppStore().handReloadFlag = false;
    },
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      this.recordState()
    },
    setUsingContext(context: boolean) {
      this.usingContext = context
      this.recordState()
    },
    setUsingAsyncDb(async: boolean) {
      this.usingAsyncDb = async
      this.recordState()
    },
    addHistory(history: Chat.History, chatData: Chat.Chat[] = [], chatPrompt?: JuAI.ChatPrompt) {
      if (this.history.findIndex(m => m.uuid == history.uuid) > -1) return;
      this.history.unshift({ ...history, chatPrompt })
      this.chat.unshift({ uuid: history.uuid, data: chatData, chatPrompt: chatPrompt })
      this.active = history.uuid;
      this.recordState();
    },

    updateHistory(uuid: number, edit: Partial<Chat.History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.recordState();
      }
    },

    async deleteHistory(index: number) {
      this.history.splice(index, 1)
      this.chat.splice(index, 1)

      if (this.history.length === 0) {
        this.active = null
        this.reloadRoute()
        return
      }

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
        return
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          this.active = uuid
          this.reloadRoute(uuid)
        }
      }

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
      }
    },

    async setActive(uuid: number) {
      this.active = uuid
      return await this.reloadRoute(uuid)
    },

    getChatByUuidAndIndex(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    addChatByUuid(uuid: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now()
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === 'New Chat')
            this.history[0].title = chat.text
          this.recordState()
        }
      }
      const index = this.chat.findIndex(item => item.uuid == uuid)
      if (index !== -1) {
        if (chat.id && this.chat[index].data.findIndex(m => m.id == chat.id) > -1)
          return;
        this.chat[index].data.push(chat)
        if (this.history[index].title === 'New Chat')
          this.history[index].title = chat.text
        this.recordState()
      }
    },

    updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        this.recordState()
      }
    },
    updateChatById(uuid: number, id: string, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          let itemIndex = this.chat[0].data.length - 1;
          this.chat[0].data[itemIndex] = { ...this.chat[0].data[itemIndex], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        let itemIndex = this.chat[chatIndex].data.findIndex(m => m.id == id);
        this.chat[chatIndex].data[itemIndex] = { ...this.chat[chatIndex].data[itemIndex], ...chat }
        this.recordState()
      }
    },
    updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    deleteChatByUuid(uuid: number, index: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1)
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1)
        this.recordState()
      }
    },

    clearChatByUuid(uuid: number) {
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = []
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.recordState()
      }
    },

    clearHistory() {
      this.$state = { ...defaultState() }
      this.recordState()
    },

    async reloadRoute(uuid?: number) {
      this.recordState();
      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index == -1) {
        this.active = this.chat[0].uuid;
        await router.push('chat');
        return;
      }
      await router.push('chat?uuid=' + uuid);
    },

    recordState() {
      setLocalState(this.$state)
    }
  },
})
