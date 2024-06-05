import { useChatStore } from "@/store/modules/chat";
import { request } from "../../request";
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { useAICommonStore } from "@/store/modules/aicommon";

export function fetchChatAPIProcess<T = any>(
  uuid: number,
  prompt: string,
  conversationId: number,
  chatDbId: string | null,
  options: {  //共享聊天，群聊相关配置
    model: string,
    isGroup: boolean,
    headers?: any
  },
  cancelToken?: GenericAbortSignal,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  const chatStore = useChatStore();
  var curChat = chatStore.getConversationByUuid(uuid);
  var curModel = useAICommonStore().getModelByModelName(options.model)!;
  let maxContext = curChat.maxContext, model = curModel.name, rolePrompt = curChat.chatPrompt?.prompt, url = curModel.url;
  if (!model || !url) return window.$message?.warning("该群聊会话无效，请重新创建");;
  const chatRequest: Chat.ChatGptRequest = {
    prompt: prompt,
    model: model,
    options: {
      conversationId: conversationId.toString(),
      chatDbId: chatDbId,
      maxContext: maxContext,
      useAsyncDb: chatStore.usingAsyncDb,
      rolePrompt: rolePrompt
    }
  }
  return request<T>({
    url: url,
    data: chatRequest,
    signal: cancelToken,
    onDownloadProgress: (event: AxiosProgressEvent) => onDownloadProgress!(event),
    method: "post",
    timeout: 1000 * 60 * 5,
    headers: options?.headers,
  })
}

export function fetchShareChatDetail(num: number, pwd?: string) {
  return request<Chat.ShareInfo>({
    url: "/app/api/prompt/shareDetail/" + num + '?s=' + pwd,
    method: 'get'
  });
}
