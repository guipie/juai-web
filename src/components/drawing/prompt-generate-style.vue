<template>
  <div class="">
    <div>
      <div
        class="mb-4 shrink-0 flex flex-col rounded bg-zinc-100 focus-within:outline-none focus-within:ring-zinc-600 dark:bg-opacity-10 dark:ring-zinc-800 dark:focus-within:ring-zinc-700"
      >
        <div class="grow">
          <textarea
            class="flex min-h-[60px] w-full rounded-md border-zinc-200 px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300 resize-none border-0 bg-transparent shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="输入描述文字，中文会自动翻译英文"
            rows="8"
            v-model="drawingModel.prompt"
          >
          </textarea>
        </div>
        <div class="flex shrink flex-row-reverse">
          <div class="m-2 space-x-2">
            <n-button
              type="success"
              :disabled="drawingModel.prompt.trim().length === 0"
              size="small"
              @click="onToDrawing"
              :loading="drawing"
            >
              <template #icon>
                <svg-icon icon="bitcoin-icons:magic-wand-outline"></svg-icon>
              </template>
              {{ drawing ? "绘画中.." : "生 成" }}
            </n-button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex">
      <n-switch
        style="min-width: 90px; margin-top: 4px"
        v-model:value="drawingModel.isOpt"
      >
        <template #checked> AI优化 </template>
        <template #unchecked> 智能优化 </template>
      </n-switch>
      <n-tooltip placement="bottom" trigger="hover" :style="{ maxWidth: '400px' }">
        <template #trigger>
          <span class="color-orange text-sm cursor-pointer p-1">
            <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
          </span>
        </template>
        AI会自动优化您的提示词，目前实验阶段。
      </n-tooltip>
      <div class="w-full text-right" v-if="isTags">
        <n-button quaternary @click="drawingTagsDialog = true">
          风格
          <template #icon>
            <SvgIcon icon="material-symbols:arrow-forward-ios"></SvgIcon>
          </template>
        </n-button>
      </div>
    </div>
    <div class="text-right p-2">
      <n-drawer
        close-on-esc
        native-scrollbar
        :show-mask="false"
        :default-width="502"
        v-model:show="drawingTagsDialog"
      >
        <n-drawer-content title="绘画风格选择" :native-scrollbar="false" closable>
          <Tags :selected-items="selectedTags"></Tags>
          <template #footer>
            请勿混淆风格
            <!-- <n-button @click="onConfirm"> 确 定</n-button> -->
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-tag
        type="success"
        round
        closable
        v-for="tag in selectedTags"
        :key="tag.name"
        @close="
          selectedTags.splice(
            selectedTags.findIndex((m: any) => m.name == tag.name),
            1
          )
        "
      >
        {{ tag.name }}
      </n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Tags from "./tags.vue";
const props = defineProps({
  prompt: String,
  isOpt: Boolean,
  tags: String, // 画风
  isTags: Boolean,
  drawing: Boolean,
});
const drawingModel = ref({
  prompt: props.prompt ?? "",
  isOpt: props.isOpt ?? false,
  tags: props.tags ?? "",
});
const emit = defineEmits(["toDrawing", "update:tags", "update:isOpt", "update:prompt"]);
const selectedTags = ref<any[]>([]);
const drawingTagsDialog = ref(false);
const onToDrawing = () => {
  if (selectedTags.value.length > 0)
    emit("update:tags", selectedTags.value.map((m: any) => m.value).join(","));
  emit("update:prompt", drawingModel.value.prompt);
  emit("update:isOpt", drawingModel.value.isOpt);
  emit("toDrawing");
};
</script>
