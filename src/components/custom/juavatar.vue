<template>
  <n-avatar  object-fit="cover" :size="48" lazy :src="imageSrc" fallback-src="juaiImage" />
</template>
<script setup lang="ts">
import juaiImage from "@/assets/juai.jpg";
// import loadingImage from "@/assets/drawing.gif";
interface Props {
  src?: string | undefined | null;
  size?: number;
  previewDisabled?: boolean;
  style?: string;
}

const props = defineProps<Props>();

const imageSrc = props.src ? props.src : juaiImage;
</script>
