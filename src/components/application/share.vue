<template>
  <div>
    <n-modal
      v-if="props.value"
      style="width: 600px"
      :key="props.applicationId"
      :mask-closable="false"
      :show="props.value"
      preset="card"
      transform-origin="center"
      :title="'共享应用-【' + applicationTitle + '】'"
      @update-show="closeModal"
    >
      <n-list :show-divider="false" id="personCreate" v-if="shareSuccessed" bordered>
        <template #header>
          <div class="flex items-center">
            <div class="m2">
              <span class="text-4xl" style="color: var(--n-icon-color)">
                <SvgIcon icon="clarity:success-standard-solid"></SvgIcon
              ></span>
            </div>
            <div>
              <div style="color: #faad14; font-weight: 700">分享链接和验证码已经复制</div>
              <div class="text-3 op80">
                快去通过QQ，微信，微博，小红书，抖音等去分享吧
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="text-right p4">
            <!-- <n-button @click="closeModal">关闭</n-button> -->
            <n-button @click="toCopyShareLink()"> 复制链接及验证码 </n-button>
            &nbsp;&nbsp;
            <n-button @click="toCopyShareLink('link')" type="success">
              复制链接
            </n-button>
          </div>
        </template>
        <n-list-item>
          <template #prefix> <div class="w-16">链接：</div> </template>
          <n-thing>
            <n-input :value="shareSettings.numUrl" readonly="true"> </n-input>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <template #prefix> <div class="w-16">验证码</div> </template>
          <div class="w-28">
            <n-input :value="shareSettings.pwd"> </n-input>
          </div>
        </n-list-item>
      </n-list>
      <n-list :show-divider="false" id="personCreate" v-else bordered>
        <template #header> 共享给他人使用，会消耗您的积分，请谨慎。 </template>
        <template #footer>
          <div class="text-right p4">
            <n-button @click="closeModal">取 消</n-button>
            &nbsp;&nbsp;
            <n-button @click="toShare()" :loading="shareCreating" type="success">
              创建分享链接
            </n-button>
          </div>
        </template>
        <n-list-item>
          <template #prefix> <div class="w-16">共享方式</div> </template>
          <n-thing>
            <n-space vertical>
              <div>
                <n-radio
                  @update-checked="
                    vcodeType = 1;
                    shareSettings.pwd = '';
                  "
                  :checked="vcodeType == 1"
                >
                  系统随机生成验证码
                </n-radio>
                <div class="pl-4 text-3 op60">创建时系统自动生成随机验证码</div>
              </div>
              <n-radio @update-checked="vcodeType = 2" :checked="vcodeType == 2">
                自定义验证码
              </n-radio>
              <div class="pl-4 text-3 op60">
                <NInput v-if="vcodeType == 2" v-model:value="shareSettings.pwd"></NInput>
              </div>
            </n-space>
          </n-thing>
        </n-list-item>

        <n-list-item>
          <template #prefix> <div class="w-16">积分限制</div> </template>
          <n-thing>
            <n-space vertical>
              <div>
                <n-radio
                  @update-checked="
                    pointsType = 1;
                    shareSettings.pointsLimit = 0;
                  "
                  :checked="pointsType == 1"
                >
                  无限制
                </n-radio>
              </div>
              <n-radio
                @update-checked="
                  pointsType = 2;
                  shareSettings.pointsLimit = 10000;
                "
                :checked="pointsType == 2"
              >
                自定义
              </n-radio>
              <div class="pl-4 text-3 op60">
                <NInput-number
                  v-if="pointsType == 2" :step="10000"
                  v-model:value="shareSettings.pointsLimit"
                >
                  <template #suffix>
                    <span class="pl-4 text-3 op60">超出此积分分享失效</span>
                  </template>
                </NInput-number>
              </div>
            </n-space>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <template #prefix> <div class="w-16">访问人数</div> </template>
          <template #suffix>
            <div class="w-28">
              <n-input-number
                :max="100"
                :min="1"
                v-if="personNumType == 2"
                v-model:value="shareSettings.accessPersonNum"
              >
                <template #suffix> 人 </template>
              </n-input-number>
            </div>
          </template>
          <n-thing>
            <NRadioGroup v-model:value="personNumType">
              <n-radio :value="1">不限</n-radio>
              <n-radio :value="2"> 自定义 </n-radio>
            </NRadioGroup>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <template #prefix> <div class="w-16">有效期</div> </template>
          <n-thing>
            <NRadioGroup v-model:value="shareSettings.effectiveDays">
              <n-radio :value="item" :key="item" v-for="item in [0, 1, 7, 30, 60, 365]">
                {{ item > 0 ? item + "天" : "永久有效" }}
              </n-radio>
            </NRadioGroup>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>
import { sharePrompt } from "@/service/api";
import { copyToClip } from "@/utils/common";
import { ref } from "vue";

interface Props {
  value: boolean;
  applicationId: number;
  applicationTitle: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:value"]);
const vcodeType = ref<1 | 2>(1);
const pointsType = ref<1 | 2>(1);
const personNumType = ref<number>(1);
const shareSuccessed = ref(false);
const shareCreating = ref(false);
const shareSettings = ref<JuAI.PromptShareSetting>({
  promptId: props.applicationId,
  pwd: "",
  accessPersonNum: 0,
  effectiveDays: 0,
  pointsLimit: 0,
});
const toShare = () => {
  shareCreating.value = true;
  sharePrompt(shareSettings.value)
    .then((res) => {
      if (res.data?.id && res.data?.id > 0) {
        shareSuccessed.value = true;
        shareSettings.value = res.data;
        shareSettings.value.numUrl =
          window.location.origin +
          "/chat-share/" +
          res.data.numUrl +
          "?s=" +
          res.data.pwd;
      }
    })
    .finally(() => (shareCreating.value = false));
};
const toCopyShareLink = async (type?: string) => {
  if (type == "link") await copyToClip(shareSettings.value.numUrl!);
  else
    await copyToClip(
      "链接:" + shareSettings.value.numUrl + ";\n验证码:" + shareSettings.value.pwd + ";"
    );
};
const closeModal = () => {
  emit("update:value", !props.value);
  shareSuccessed.value = false;
};
</script>
