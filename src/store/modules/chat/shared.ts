
import { localStg as ss } from '@/utils/storage';
const LOCAL_NAME = 'chatState'
const DEAFULT_MODEL = "gpt-3.5-turbo";
export function defaultState(): Chat.ChatState {
  return {
    deafultModel: DEAFULT_MODEL,
    siderCollapsed: false,
    // active: uuid,
    // usingContext: true,
    usingAsyncDb: true,
    // history: [],
    conversations: [],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = ss.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  ss.set(LOCAL_NAME, state)
}
