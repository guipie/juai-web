<template>
  <div
    class="mb-4 shrink-0 flex flex-col rounded bg-zinc-100 ring-1 ring-zinc-300 ring-offset-0 focus-within:outline-none focus-within:ring-zinc-600 dark:bg-black dark:ring-zinc-800 dark:focus-within:ring-zinc-700"
  >
    <div class="grow">
      <textarea
        class="flex min-h-[60px] w-full rounded-md border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300 resize-none border-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="输入描述文字，中文会自动翻译英文"
        rows="8"
        :value="props.prompt"
        @input="emit('update:prompt', ($event.target as HTMLInputElement).value)"
      >
      </textarea>
      <!-- <n-input
        :value="props.prompt"
        clearable
        :rows="8"
        :autosize="{
          minRows: 3,
          maxRows: 12,
        }"
        @input="emit('update:prompt', $event)"
        type="textarea"
        placeholder="输入描述文字，中文会自动翻译英文"
      /> -->
    </div>
    <div class="flex shrink flex-row-reverse">
      <div class="m-2 space-x-2">
        <n-button
          type="success"
          size="small"
          @click="emit('toDrawing')"
          :loading="props.drawing"
        >
          <template #icon>
            <svg-icon icon="bitcoin-icons:magic-wand-outline"></svg-icon>
          </template>
          {{ drawing ? "绘画中.." : "生 成" }}
        </n-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  prompt: string;
  drawing: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["toDrawing", "update:prompt"]);
</script>

<style scoped></style>
