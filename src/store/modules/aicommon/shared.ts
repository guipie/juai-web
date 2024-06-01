import { localStg } from "@/utils/storage"

const LOCAL_NAME = 'aiCommonState'

export function defaultState(): JuAI.AICommonState {
  return {
    models: [],
    applications: [],
    myApplications: [],
    examplePromptList: [],
  }
}

export function getLocalState(): JuAI.AICommonState {
  const localState = localStg.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: JuAI.AICommonState) {
  localStg.set(LOCAL_NAME, state)
}

