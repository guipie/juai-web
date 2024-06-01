
import { Drawing } from "@/typings/ai/drawing";
import { sessionStg } from "@/utils/storage"

const LOCAL_NAME = 'drawingState'

export function getLocalState(): Drawing.DrawingState {
  var localState = sessionStg.get(LOCAL_NAME);
  if (!localState) return { configurations: [] };
  else if (!localState.configurations) return { configurations: [] };
  else
    return localState ?? { configurations: [] };
}

export function setLocalState(state: Drawing.DrawingState) {
  sessionStg.set(LOCAL_NAME, state);
}
