import { request } from '../../request';
/** get model  list */
export function getChatModels() {
  return request<JuAI.AIModel[]>({
    url: "/app/api/aimodel/models",
    method: 'get'
  });
}


/** prompt相关接口 */
export function postPrompt(data: JuAI.ChatPrompt, avatar?: File | null) {
  var formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  if (avatar)
    formData.append("file", avatar);
  return request<JuAI.ChatPrompt>({
    url: "/app/api/prompt",
    data: formData,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}
export function deletePrompts(ids: number[]) {
  return request<boolean>({
    url: "/app/api/prompt/" + ids,
    method: 'delete'
  });
}

export function getPrompts() {
  return request<JuAI.ChatPrompt[]>({
    url: "/app/api/prompt",
    method: 'get'
  });
}

export function getMyPrompts() {
  return request<JuAI.ChatPrompt[]>({
    url: "/app/api/prompt/my",
    method: 'get'
  });
}
export function getExamplePrompts() {
  return request<any>({
    url: "/app/api/prompt/examples",
    method: 'get'
  });
}
export function sharePrompt(shareModel: JuAI.PromptShareSetting) {
  return request<JuAI.PromptShareSetting>({
    url: "/app/api/prompt/share",
    method: 'post',
    data: shareModel
  });
}
