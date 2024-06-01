import { useChatStore } from "@/store/modules/chat";
import { request } from "../../request";
import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'

export function fetchChatAPIProcess<T = any>(
  prompt: string,
  conversationId: number,
  chatDbId: string | null,
  chatType: Chat.ChatType,
  cancelToken?: GenericAbortSignal,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent, model: string) => void,
  options?: {
    model?: string,
    headers?: any
  }
) {
  const chatStore = useChatStore();
  let currentChatOptions = chatStore.getCurrentOptions(chatType, options?.model);
  const chatRequest: Chat.ChatGptRequest = {
    prompt: prompt,
    model: currentChatOptions.model,
    options: {
      conversationId: conversationId.toString(),
      chatDbId: chatDbId,
      useContext: currentChatOptions.usingContext,
      useAsyncDb: chatStore.usingAsyncDb,
      rolePrompt: currentChatOptions.rolePrompt
    }
  }
  console.log(chatRequest);

  return request<T>({
    url: currentChatOptions.url,
    data: chatRequest,
    signal: cancelToken,
    onDownloadProgress: (event: AxiosProgressEvent) => onDownloadProgress!(event, options!.model!),
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
