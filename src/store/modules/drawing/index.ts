import { SetupStoreId } from "@/enum"
import { defineStore } from "pinia"
import { getLocalState, setLocalState } from "./shared"
import { drawingConfigs } from "@/utils/data/drawingData";
import { Drawing } from "@/typings/ai/drawing";

export const useDrawingStore = defineStore(SetupStoreId.Drawing, {
  state: (): Drawing.DrawingState => getLocalState(),
  getters: {
  },
  actions: {
    drawingInit() {
      this.configurations = drawingConfigs;
      setLocalState(this.$state);
    },
  }
})
