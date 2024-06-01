<template>
  <div class="h-full">
    <div class="grid lg:grid-cols-6 sm:grid-cols-2 gap-3" v-if="prompts.length > 0">
      <div
        v-for="item in prompts"
        :key="item.id!"
        class="rounded-lg shadow-xl cursor-pointer"
      >
        <div class="lg:p-2 relative sm:p-0">
          <div
            @click="
              showCreate = true;
              application = item;
              application.showDetail = true;
            "
          >
            <header class="font-semibold text-lg text-center text-ellipsis line-clamp-1">
              {{ item.title }}
            </header>
            <div class="pt-2">
              <ju-image
                :style="'max-height:167px;'"
                :src="item.avatar"
                preview-disabled
              ></ju-image>
            </div>
          </div>
          <div class="mb-1 float-right">
            <n-button quaternary type="warning" @click="toShareDialog(item)">
              共享
            </n-button>
            <n-button quaternary type="primary" @click="aiStore.toUseApplication(item)">
              直接使用
            </n-button>
            <div v-if="props.type == '自定义'">
              <n-popconfirm
                @positive-click="aiStore.deleteMyApplication(item.id!)"
                @negative-click=""
              >
                <template #trigger>
                  <n-button quaternary type="error">
                    {{ $t("common.delete") }}
                  </n-button>
                </template>
                {{ $t("common.confirmDelete") }}
              </n-popconfirm>
              <n-button
                quaternary
                @click="
                  showCreate = true;
                  application = item;
                  application.showDetail = false;
                "
              >
                {{ $t("common.edit") }}
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-full w-full col-span-6 mt-60">
      <n-empty description="暂无定义应用">
        <template #extra>
          <n-button size="small" @click="emit('onCreateDialog')"> 去创建 </n-button>
        </template>
      </n-empty>
    </div>
    <prompt
      :value="showCreate"
      :key="
        (application?.id ?? 1) + (application?.showDetail ? 1 : 2) + showCreate.toString()
      "
      :prompt-model="application"
      @update:value="(val) => (showCreate = val)"
      @on-share-dialog="toShareDialog"
    ></prompt>
    <share
      :value="showShare"
      :key="showShareId"
      :application-id="showShareId"
      :application-title="showShareTitle"
      @update:value="(val) => (showShare = val)"
    ></share>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useAICommonStore } from "@/store/modules/aicommon/index";
import juImage from "@/components/custom/juImage.vue";
import prompt from "@/components/application/prompt.vue";
import share from "@/components/application/share.vue";
import { $t } from "@/locales";
const aiStore = useAICommonStore();
interface Props {
  type?: string;
}
const props = defineProps<Props>();
// interface Emit {
//   (ev: "onconfirmselect", prompts: ChatEx.ChatPrompt[]): void;
// }

const emit = defineEmits(["onCreateDialog"]);
const prompts = computed(() => {
  let prompts = aiStore.applications.filter(
    (m) => props.type == "全部" || (m.tags ?? "").split(",").includes(props.type ?? "")
  );
  if (props.type == "大模型")
    prompts = aiStore.models.map((m) => {
      return {
        id: m.id,
        title: m.name,
        prompt:
          "作为" +
          m.modelId.split(":")[0] +
          "训练的" +
          m.modelId.split(":")[1] +
          "大模型,你需要回答我所有的问题。(" +
          m.desc +
          ")",
        avatar: m.avatarUrl ?? "",
        maxContext: 3,
        initMessage: "我是" + m.name + ",有什么可以帮你的吗？",
        promptExtend: "",
        type: "user",
        model: m.modelId,
        vendor: m.modelId.split(":")[0],
      };
    });
  else if (props.type == "自定义") prompts = aiStore.myApplications;
  return prompts;
});
const application = ref<JuAI.ChatPrompt>();
const showCreate = ref(false);
const showShare = ref(false);
const showShareId = ref<number>(0);
const showShareTitle = ref("");
const toShareDialog = (item: JuAI.ChatPrompt) => {
  showShare.value = !showShare.value;
  showShareId.value = item.id!;
  showShareTitle.value = item.title;
};
//暴露showCreate方法
defineExpose({
  showCreate,
});
</script>
<style>
.n-upload-trigger {
  width: 100%;
  text-align: right;
}
.n-upload-file-list {
  height: 100%;
}
.n-upload-file-list .n-upload-file.n-upload-file--image-card-type {
  width: 58px;
  height: 58px;
}
.n-upload-trigger.n-upload-trigger--image-card {
  width: 58px;
  height: 58px;
}
</style>
