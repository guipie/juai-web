<script setup lang="ts">
import defaultAvatar from "@/assets/juai.jpg";
import { useAICommonStore } from "@/store/modules/aicommon";
import { NText, SelectRenderLabel, SelectRenderTag, UploadFileInfo } from "naive-ui";
import { computed, h, ref } from "vue";
const aiStore = useAICommonStore();
interface Props {
  value: boolean;
  promptModel?: JuAI.ChatPrompt;
}
const props = withDefaults(defineProps<Props>(), {
  value: false,
  promptModel: () => ({
    title: "",
    prompt: "",
    promptExtend: "",
    initMessage: "",
    maxContext: 3,
    type: "user",
    model: "gpt-3.5-turbo",
    vendor: "openai",
  }),
});
const application = ref<JuAI.ChatPrompt>({ ...props.promptModel });
const modelDialog = computed(() => props.value);
const emit = defineEmits(["update:value", "onShareDialog"]);
const createModelAvatar = ref<UploadFileInfo[]>([
  {
    id: "avatar",
    name: "自定义.png",
    status: "finished",
    url: props.promptModel.avatar ?? defaultAvatar,
  },
]);

const showCreateMore = ref(false);
const creating = ref(false);
const models = ref<Array<any>>();
const showCreteMaxContexts = [
  {
    label: "无记忆",
    value: 0,
    desc: "每次对话都是独立的，常用于一次性问答，节省积分",
  },
  {
    label: "基础",
    value: 3,
    desc: "记住最近的三次对话",
  },
  {
    label: "中等",
    value: 6,
    desc: "记住最近的六次对话",
  },
  {
    label: "高级",
    value: 1000,
    desc: "记住当前会话的所有对话，慎用，消耗积分较多",
  },
];
const renderMaxContextLabel: SelectRenderLabel = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0",
          },
        },
        [
          h("div", null, [option.label as string]),
          h(
            NText,
            { depth: 3, tag: "div" },
            {
              default: () => option.desc as string,
            }
          ),
        ]
      ),
    ]
  );
};
const renderSelectMaxContext: SelectRenderTag = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.label as string]
  );
};
const handleCreate = () => {
  console.log(createModelAvatar);
  if (!models.value || models.value.length <= 1)
    return window.$message?.warning("请选择至少两个模型");
  if (!application.value.title.trim()) application.value.title = "群聊";
  application.value.vendor = models.value[0].split(":")[0];
  application.value.model = models.value[0].split(":")[1];
  application.value.prompt = "这是一个大模型群聊";
  application.value.promptExtend = models.value.map((m) => m.split(":")[1]).join(":");
  application.value.isGroup = true;
  creating.value = true;
  aiStore
    .postMyApplication(application.value)
    .then((res) => {
      emit("update:value", !modelDialog);
      aiStore.toUseApplication(res.data!);
    })
    .finally(() => (creating.value = false));
};
</script>

<template>
  <div>
    <n-modal
      style="width: 600px; height: 100%"
      :mask-closable="false"
      :show="modelDialog"
      preset="dialog"
      title="创建群聊"
      @update-show="emit('update:value', !modelDialog)"
    >
      <n-list :show-divider="false" id="personCreate" disabled>
        <n-list-item>
          <template #prefix> <div class="w-24">群聊名称</div> </template>
          <n-thing>
            <span v-if="application.showDetail">{{ application.title }}</span>
            <n-input
              v-else
              v-model:value="application.title"
              placeholder="名称可填"
            ></n-input>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <template #prefix> <div class="w-24">AI模型选择</div> </template>
          <n-thing>
            <n-transfer
              ref="transfer"
              v-model:value="models"
              virtual-scroll
              :options="
                aiStore.models.map((item) => ({
                  label: item.name,
                  value: item.modelId,
                }))
              "
              source-filterable
            />
          </n-thing>
        </n-list-item>
        <n-list-item v-if="showCreateMore">
          <n-thing>
            <template #description> <div class="w-16">引导语</div> </template>
            <n-input v-model:value="application.initMessage" type="textarea"></n-input>
          </n-thing>
        </n-list-item>
        <n-list-item v-if="showCreateMore">
          <template #prefix> <div class="w-14">记忆深度</div> </template>
          <n-thing content-style="text-align: right;">
            <n-select
              v-model:value="application.maxContext"
              :options="showCreteMaxContexts"
              :render-label="renderMaxContextLabel"
              :render-tag="renderSelectMaxContext"
            />
          </n-thing>
        </n-list-item>
      </n-list>
      <template #action>
        <div class="flex justify-between w-full">
          <n-button text @click="showCreateMore = !showCreateMore">
            选项配置
            <template #icon>
              <svg-icon
                class="w-8 h-8"
                v-if="showCreateMore"
                icon="raphael:arrowup"
              ></svg-icon>
              <svg-icon class="w-8 h-8" v-else icon="raphael:arrowright2"></svg-icon>
            </template>
          </n-button>
          <div class="flex w-full pl-10 justify-between" v-if="application.showDetail">
            <n-button
              @click="
                aiStore.toUseApplication(application);
                emit('update:value', !modelDialog);
              "
              style="width: 60%"
              type="success"
            >
              确定创建
            </n-button>
          </div>
          <div class="flex-1 w-full pl-10" v-else>
            <n-button
              @click="handleCreate"
              :loading="creating"
              style="width: 100%"
              type="success"
            >
              保存
            </n-button>
          </div>
        </div>
      </template>
    </n-modal>
  </div>
</template>
