<template>
  <div class="grid lg:grid-cols-2 sm:grid-cols-1 h-full overflow-y-auto pb-30">
    <div>
      <PromptGenerateStyle
        @to-drawing="toDrawing"
        v-model:prompt="createRequest.prompt"
        v-model:is-opt="createRequest.isOpt"
        v-model:tags="createRequest.tags"
        :drawing="drawing"
        :is-tags="true"
      ></PromptGenerateStyle>
      <div class="py-3 flex">
        <n-radio-group v-model:value="createRequest.style">
          <n-radio-button value="natural"> 自然 </n-radio-button>
          <n-radio-button value="vivid"> 生动 </n-radio-button>
        </n-radio-group>
        <n-tooltip trigger="hover">
          <template #trigger>
            <span class="color-orange text-sm cursor-pointer p-2">
              <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
            </span>
          </template>
          【生动】使模型倾向于生成超真实和戏剧性的图像。【自然】使模型生成更自然、不太真实的图像。默认为“生动”。
        </n-tooltip>
      </div>
      <div class="py-3 flex">
        <n-radio-group v-model:value="createRequest.quality">
          <n-radio-button value="hd">高清</n-radio-button>
          <n-radio-button value="standard">标准</n-radio-button>
        </n-radio-group>
        <n-tooltip trigger="hover">
          <template #trigger>
            <span class="color-orange text-sm cursor-pointer p-2">
              <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
            </span>
          </template>
          生成的图像的质量，“高清”创建的图像具有更精细的细节和更高的图像一致性。默认为“标准”。
        </n-tooltip>
      </div>
      <div class="py-3">
        <n-radio-group
          v-model:value="createRequest.model"
          @change="
            createRequest.size = '1024x1024';
            createRequest.n = 1;
          "
        >
          <n-radio-button
            :value="key"
            v-for="key in Object.keys(changeModels)"
            :key="key"
          >
            {{ key }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <div class="py-3">
        <n-radio-group v-model:value="createRequest.size">
          <n-space>
            <n-radio
              v-for="size in changeModels[createRequest.model]"
              :key="size"
              :value="size"
            >
              {{ size }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>
      <div class="py-3" v-if="createRequest.model === 'dall-e-2'">
        <n-slider
          v-model:value="createRequest.n"
          :default-value="1"
          :step="1"
          :max="10"
          :min="1"
          :format-tooltip="(num) => `${num}幅`"
          :marks="{ 1: '1幅', 10: '10幅' }"
        />
      </div>
    </div>
    <div class="mx-6">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref} from "vue";
const emit = defineEmits(["toFetchDrawing"]);
const props = defineProps({
  drawing: Boolean,
  defaultRequest: Object,
});
const createRequest = ref<any>(props.defaultRequest);
interface Model_Type {
  [key: string]: Array<string>; // 字段扩展声明
}
const changeModels: Model_Type = {
  "dall-e-2": ["256x256", "512x512", "1024x1024"],
  "dall-e-3": ["1024x1024", "1792x1024", "1024x1792"],
};
const toDrawing = () => {
  emit("toFetchDrawing", createRequest.value);
};
</script>

<style scoped></style>
