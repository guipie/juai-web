
import { localStg as ss } from '@/utils/storage';
const LOCAL_NAME = 'chatState'

export function defaultState(): Chat.ChatState {
  const uuid = 1002
  return {
    currentModel: "openai:gpt-3.5-turbo",
    siderCollapsed: false,
    active: uuid,
    usingContext: true,
    usingAsyncDb: true,
    history: [{ uuid, title: 'New Chat', isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}
