<template>
  <div class="parent-class aspect-square cursor-pointer relative">
    <div v-if="props.drawingResponse.executionStatus === ExecutionStatuseEnum.executing">
      <DrawingProgress :percentage="80"></DrawingProgress>
    </div>
    <ju-image
      v-else-if="!images || images.length <= 1"
      :key="drawingResponse.ossUrl"
      :src="drawingResponse.ossUrl"
      :preview-disabled="false"
      is-opacity
      :is-scale="false"
    ></ju-image>
    <div v-else>
      <NImageGroup>
        <ju-image
          v-for="(image, index) in images"
          v-show="index === 0"
          :key="index"
          :src="image"
          :preview-disabled="false"
          is-opacity
          :is-scale="false"
        ></ju-image>
      </NImageGroup>
      <div
        class="absolute top-1 right-1 bg-blueGray o px-2 rounded-2 text-white select-all"
      >
        {{ images?.length }}张
      </div>
    </div>
    <div
      class="child-class hidden absolute top-1/2 left-2 w-full"
      style="pointer-events: none"
    >
      <h1
        class="indent-sm line-clamp-6 text-white"
        v-if="props.drawingResponse.executionStatus != ExecutionStatuseEnum.executing"
      >
        {{ props.drawingResponse.prompt }}
      </h1>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Drawing } from "@/typings/ai/drawing";
import { PropType } from "vue";
import { ExecutionStatuseEnum } from "@/typings/enums/drawing-enum";
const props = defineProps({
  drawingResponse: {
    type: Object as PropType<Drawing.DrawingResponse>,
    required: true,
  },
});
const images = props.drawingResponse.ossUrl?.split(",");
</script>

<style scoped>
.parent-class:hover > .child-class {
  display: block;
}
</style>
