import { NButton } from 'naive-ui';
<script setup lang="ts">
interface Emit {
  (e: "click"): void;
}

const emit = defineEmits<Emit>();

function handleClick() {
  emit("click");
}
</script>

<template>
  <NButton
    class="flex items-center justify-center transition rounded-full"
    @click="handleClick"
  >
    <slot />
  </NButton>
</template>
