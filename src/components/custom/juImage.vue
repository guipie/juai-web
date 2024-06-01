<template>
  <n-image
    :src="imageSrc"
    :fallback-src="errorImage"
    :preview-disabled="previewDisabled ?? true"
    :preview-src="imageSrc"
    :style="`width: ${width ?? 260};height: ${height ?? 260};${style ?? ''}`"
    object-fit="cover"
    lazy
    class="cursor-pointer hover:z-200 transition-all hover:-translate-y-[.5rem]"
    :class="{ 'hover:scale-110': isScale, 'hover:opacity-70': isOpacity }"
  >
    <template #placeholder>
      <n-skeleton :height="height ?? 160 + 'px'" :sharp="false"></n-skeleton>
    </template>
  </n-image>
</template>
<script setup lang="ts">
import errorImage from "@/assets/loaderror.png";
import { computed } from "vue";
// import loadingImage from "@/assets/drawing.gif";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  previewDisabled: {
    type: Boolean,
    default: true,
  },
  width: {
    type: Number,
    default: 260,
  },
  height: {
    type: Number,
    default: 260,
  },
  style: {
    type: String,
    default: "",
  },
  isScale: {
    type: Boolean,
    default: true,
  },
  isOpacity: {
    type: Boolean,
    default: false,
  },
});

const imageSrc = computed(() => (props.src ? props.src : errorImage));
</script>
<
<style>
.n-image {
  display: inline;
}
.n-image img {
  width: 100%;
}
</style>
