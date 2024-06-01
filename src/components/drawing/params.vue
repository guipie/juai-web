<template>
  <div>
    <div class="mb-2 rounded text-right">
      <n-button quaternary type="warning"> 我的 </n-button>
    </div>
    <div
      class="mb-2 rounded border border-zinc-200 bg-zinc-100 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400"
    >
      按需生成消耗为
      <strong v-if="props.drawingType == 'openai'">5K-20k积分左右</strong>
      <strong v-else>500积分 / 步骤</strong>
      .
    </div>
    <n-list>
      <template #header> <div class="p-2">配置信息</div> </template>
      <template #footer>
        <div class="text-right pr-4">
          <NButton size="small" @click="onReset">重 置</NButton>
        </div>
      </template>
      <div v-for="item in localKeys">
        <n-list-item v-if="keys.includes(item)" class="mx-4">
          <n-thing
            :title="drawingParameters[item].label"
            content-style="margin-top: 10px;"
          >
            <div v-if="drawingParameters[item].type == 'number'">
              <n-slider
                v-model:value="requestParam[item]"
                :step="drawingParameters[item].step"
                :min="drawingParameters[item].min"
                :max="drawingParameters[item].max"
                :disabled="item == 'seed' && randomSeed"
              />
              <div class="text-right">
                <n-checkbox
                  v-if="item == 'seed'"
                  v-model:checked="randomSeed"
                  :on-update:checked="(val:boolean) => (requestParam.seed = val ? -1 : 11111226690)"
                  size="small"
                  label="随机"
                />
              </div>
            </div>
            <div v-else-if="item == 'model' && props.drawingType == 'openai'">
              <n-radio-group
                v-model:value="requestParam[item]"
                @update-value="requestParam['size'] = '1024x1024'"
                name="radiogroup"
              >
                <n-space>
                  <n-radio
                    v-for="song in drawingParameters[item].selectVal"
                    :key="song.value"
                    :value="song.value"
                  >
                    {{ song.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
              <div class="pt-4">
                <n-radio-group
                  v-model:value="requestParam['size']"
                  name="radiobuttongroup1"
                >
                  <n-radio-button
                    v-for="size in requestParam[item] == 'dall-e-2'
                      ? ['256x256', '512x512', '1024x1024']
                      : ['1024x1024', '1024x1792', '1792x1024']"
                    :key="size"
                    :value="size"
                    :label="size"
                  />
                </n-radio-group>
              </div>
            </div>
          </n-thing>
          <template #suffix>
            <n-ellipsis style="width: 40px" v-if="!drawingParameters[item].hiddenVal">
              {{ requestParam[item] }}
            </n-ellipsis>
            <n-tooltip
              v-if="drawingParameters[item].desc"
              placement="bottom"
              trigger="hover"
              :style="{ maxWidth: '400px' }"
            >
              <template #trigger>
                <span class="color-orange text-lg cursor-pointer">
                  <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
                </span>
              </template>
              {{ drawingParameters[item].desc }}
            </n-tooltip>
          </template>
        </n-list-item>
      </div>
    </n-list>
  </div>
</template>
<script lang="ts" setup>
import { drawingParameters } from "@/constants/common";
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    parameters: any;
    drawingType: string;
  }>(),
  { parameters: {}, drawingType: "" }
);
const emit = defineEmits(["setTool"]);
const randomSeed = ref(true);
const requestParam = ref(JSON.parse(JSON.stringify(props.parameters)));
const keys = computed(() => Object.keys(props.parameters));
const localKeys = computed(() => Object.keys(drawingParameters));
const onReset = () => {
  requestParam.value = { ...requestParam, ...props.parameters };
};
watch(
  () => requestParam,
  () => {
    emit("setTool", requestParam.value);
  },
  { deep: true }
);
</script>
