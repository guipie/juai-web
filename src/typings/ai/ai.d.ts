declare namespace JuAI {

  interface AIModel {
    id: number,
    modelId: string,
    name: string,
    shortName: string,
    avatarUrl: string | null,
    url?: string,
    category: string,
    desc: string,
  }
  interface AICommonState {
    models: JuAI.AIModel[],
    examplePromptList: any,
    applications: JuAI.ChatPrompt[],
    myApplications: JuAI.ChatPrompt[],
  }
  interface ChatPrompt {
    id?: number,
    title: string,
    prompt: string,
    promptExtend: any,
    maxContext: number,
    avatar?: string,
    tags?: string,
    initMessage: string,
    type: string,
    model: string,
    vendor: string,
    showDetail?: boolean,
    isGroup?: boolean,
  }
  interface PromptShareSetting {
    id?: bigint,
    promptId: number,
    pwd: string,
    accessPersonNum: number,
    effectiveDays: number,
    numUrl?: string,
    pointsUsed?: number,
    pointsLimit: number,
    isLogin?: boolean,
  }
  interface LastRoom {
    id?: string,
    title: string,
    prompt: string,
    lastMessage: string,
    maxContext: string,
    avatar: string,
    tags?: string,
    initMessage: string,
    model: string,
    vendor: string,
  }
  interface RoomChatRequest {
    prompt: string
    options?: { rolePrompt?: string, useContext: boolean, conversationId?: string; chatDbId: string | null }
    temperature?: number,
    top_p?: number,
    model?: string,
    url: string,
  }
}
