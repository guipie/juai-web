<template>
  <div class="grid lg:grid-cols-2 sm:grid-cols-1 h-full overflow-y-auto pb-30">
    <div>
      <PromptGenerateStyle
        @to-drawing="toDrawing"
        v-model:prompt="createRequest.input.prompt"
        v-model:is-opt="createRequest.isOpt"
        :drawing="drawing"
      ></PromptGenerateStyle>
      <div class="py-3">
        <n-radio-group v-model:value="createRequest.parameters.size">
          <n-radio-button :value="size" v-for="size in sizes" :key="size">
            {{ size }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <div class="py-3">
        <n-radio-group v-model:value="createRequest.parameters.style">
          <n-radio-button :value="key" v-for="key in Object.keys(styles)" :key="key">
            {{ styles[key] }}
          </n-radio-button>
        </n-radio-group>
      </div>
      <div class="py-3">
        <n-slider
          v-model:value="createRequest.parameters.n"
          :step="1"
          :max="4"
          :min="1"
          :format-tooltip="(num) => `${num}幅`"
          :marks="{ 1: '1幅', 4: '4幅' }"
        />
      </div>
      <div>
        <n-collapse>
          <n-collapse-item name="1">
            <template #header>
              <n-gradient-text :size="15" type="warning"> 高级配置 </n-gradient-text>
              <n-text type="warn"> </n-text>
            </template>
            <n-thing>
              <template #header>
                <span class="text-sm text-gray">种子</span>
              </template>
              <template #header-extra>
                <n-button circle size="small">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <span class="color-orange text-sm cursor-pointer p-2">
                        <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
                      </span>
                    </template>
                    <div class="w-lg">
                      种子参数允许您为图像生成过程设置特定的种子值，有助于生成一致且可重现的图像。当您希望在图像生成中获得可重现的结果时，这将非常有用。
                    </div>
                  </n-tooltip>
                </n-button>
              </template>
              <template #description>
                <n-slider
                  v-model:value="createRequest.parameters.seed"
                  :step="1"
                  :max="4294967290"
                  :min="0"
                />
              </template>
            </n-thing>
            <NDivider></NDivider>
            <n-thing>
              <template #header>
                <span class="text-sm text-gray">不希望出现</span>
              </template>
              <template #header-extra>
                <n-button circle size="small">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <span class="color-orange text-sm cursor-pointer p-2">
                        <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
                      </span>
                    </template>
                    <div class="w-lg">
                      画面中不想出现的内容描述词信息。支持中英文，长度不超过500个字符，超过部分会自动截断。例如：低分辨率、错误、最差质量、低质量、jpeg
                      伪影、丑陋、重复、病态、残缺、超出框架、多余的手指、变异的手、画得不好的手、画得不好的脸、突变、变形、模糊、脱水、不良的解剖结构、
                      比例不良、多余肢体、克隆脸、毁容、总体比例、畸形肢体、缺臂、缺腿、多余手臂、多余腿、融合手指、手指过多、长脖子、用户名、水印、签名
                    </div>
                  </n-tooltip>
                </n-button>
              </template>
              <template #description>
                <NInput
                  maxlength="500"
                  v-model:value="createRequest.parameters.negative_prompt"
                  type="textarea"
                  :rows="3"
                ></NInput>
              </template>
            </n-thing>
            <NDivider></NDivider>
            <n-thing>
              <template #header>
                <span class="text-sm text-gray">垫图</span>
              </template>
              <template #header-extra>
                <n-button circle size="small">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <span class="color-orange text-sm cursor-pointer p-2">
                        <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
                      </span>
                    </template>
                    <div class="w-lg">
                      上传参考图像；可根据参考图生成图片; 图片格式可为 jpg, png, tiff,
                      webp等常见位图格式
                    </div>
                  </n-tooltip>
                </n-button>
              </template>
              <template #description>
                <!-- <n-upload
                  accept="image/png, image/jpg,image/webp,image/tiff"
                  :action="`${baseURL}app/api/juFile/uploadFile?path=drawing/request/${DrawingTypeEnum.ALIWANX}`"
                  :headers="{ 'X-Authorization': '' }"
                  list-type="image-card"
                  :max="1"
                  @change="toUploadedFinish"
                /> -->
                <UploadAuto
                  v-model:valUrl="createRequest.input.ref_img"
                  :path="`drawing/request/${DrawingTypeEnum.ALIWANX}`"
                >
                </UploadAuto>
              </template>
            </n-thing>
            <n-thing>
              <template #header>
                <span class="text-sm text-gray">与垫图（参考图）的相似度</span>
              </template>
              <template #header-extra>
                <n-button circle size="small">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <span class="color-orange text-sm cursor-pointer p-2">
                        <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
                      </span>
                    </template>
                    <div class="w-lg">
                      期望输出结果与垫图（参考图）的相似度，取值范围[0.0,
                      1.0]，数字越大，生成的结果与参考图越相似
                    </div>
                  </n-tooltip>
                </n-button>
              </template>
              <template #description>
                <n-slider
                  v-model:value="createRequest.parameters.ref_strength"
                  :step="0.1"
                  :max="1"
                  :min="0"
                />
              </template>
            </n-thing>
            <n-thing>
              <template #header>
                <span class="text-sm text-gray">垫图参考方式</span>
              </template>
              <template #header-extra>
                <n-button circle size="small">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <span class="color-orange text-sm cursor-pointer p-2">
                        <SvgIcon icon="material-symbols:question-mark-rounded"></SvgIcon>
                      </span>
                    </template>
                    <div class="w-lg">
                      垫图（参考图）生图使用的生成方式； 其中参考内容(默认)
                      代表垫图的图片内容，参考风格代表参考垫图的图片风格
                    </div>
                  </n-tooltip>
                </n-button>
              </template>
              <template #description>
                <n-radio-group v-model:value="createRequest.parameters.ref_mode">
                  <n-radio-button value="repaint"> 参考内容(默认) </n-radio-button>
                  <n-radio-button value="refonly"> 参考风格 </n-radio-button>
                </n-radio-group>
              </template>
            </n-thing>
          </n-collapse-item>
        </n-collapse>
      </div>
    </div>
    <div class="mx-6 h-full">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DrawingTypeEnum } from "@/typings/enums/drawing-enum";
import UploadAuto from "@/components/custom/upload-auto.vue";
const emit = defineEmits(["toFetchDrawing"]);
const props = defineProps({
  drawing: Boolean,
  defaultRequest: Object,
});
const createRequest = ref<any>(props.defaultRequest);
console.log("defaultRequest", createRequest.value);

const toDrawing = () => {
  emit("toFetchDrawing", createRequest.value, (res: any) => {
    console.log("toDrawing-Complete", res);
  });
};
const sizes = ["1024*1024", "720*1280", "1280*720"];
const styles: Record<string, string> = {
  "<auto>": "默认",
  "<3d cartoon>": " 3D卡通",
  "<anime>": "动画",
  "<oil painting>": " 油画",
  "<watercolor>": "水彩",
  "<sketch>": "素描",
  "<chinese painting>": "中国画",
  "<flat illustration>": " 扁平插画",
};
</script>

<style scoped></style>
