declare namespace Chat {
  type ChatType = "chat" | "group" | "share";
  interface Chat {
    id: string,
    chatDbId?: string,
    dateTime: string
    text: string
    reqText: string
    inversion?: boolean
    error?: boolean
    loading?: boolean
    model: string
  }
  interface History {
    title: string
    isEdit: boolean
    uuid: number
    model: JuAI.AIModel,
    maxContext: number,
    avatar?: string
    desc?: string
    chatPrompt?: JuAI.ChatPrompt  //聊天助手
    isShare?: boolean
  }
  interface Conversation {
    uuid: number;
    name: string;
    isEdit: boolean;
    maxContext: number;
    model: JuAI.AIModel,
    data: Chat[],
    chatPrompt?: JuAI.ChatPrompt,
    isShare?: boolean,
  }
  interface ChatState {
    deafultModel: string,
    siderCollapsed: boolean,
    // active: number
    // usingContext: boolean;
    usingAsyncDb: boolean;
    usingShareContext?: boolean;
    conversations: Conversation[];
    // history: History[]
    // chat: { uuid: number; data: Chat[], chatPrompt?: JuAI.ChatPrompt }[];
  }
  interface ChatGptRequest {
    prompt: string
    options?: {
      rolePrompt?: string,
      maxContext?: number,
      conversationId?: string,
      useAsyncDb: boolean,
      chatDbId: string | null
    }
    temperature?: number,
    top_p?: number,
    model?: string,
  }
  interface ConversationRequest {
    conversationId?: string
    parentMessageId?: string
  }

  interface ConversationResponse {
    conversationId: string
    detail: {
      choices: { finish_reason: string; index: number; logprobs: any; text: string }[]
      created: number
      id: string
      model: string
      object: string
      usage: { completion_tokens: number; prompt_tokens: number; total_tokens: number }
    }
    id: string
    parentMessageId: string
    role: string
    text: string
  }


  interface ShareInfo {
    code: number
    message?: string
    shareDetail?: any
    promptDetail?: JuAI.ChatPrompt
    url?: string
  }
}
