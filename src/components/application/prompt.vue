<script setup lang="ts">
import defaultAvatar from "@/assets/juai.jpg";
import { useAICommonStore } from "@/store/modules/aicommon";
import { NText, SelectRenderLabel, SelectRenderTag, UploadFileInfo } from "naive-ui";
import { computed, h, ref } from "vue";
import juavatar from "@/components/custom/juavatar.vue";
const aiStore = useAICommonStore();
interface Props {
  value: boolean;
  promptModel?: JuAI.ChatPrompt;
  toChat?: boolean;
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

const showCreateExample = ref(false);
const showCreateMore = ref(false);
const creating = ref(false);
// 文件上传前的限定条件
const beforeUpload = ({ file }: { file: UploadFileInfo }) => {
  if (!file.type?.startsWith("image/")) {
    window.$notification?.warning({ title: "图片格式不对" });
    return false;
  }
  createModelAvatar.value = [file];
  return true;
};
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
  if (!application.value.title.trim() || !application.value.prompt.trim())
    return window.$notification?.warning({ title: "名称和角色设定必填" });
  if (application.value.model.split(":").length == 2) {
    application.value.vendor = application.value.model.split(":")[0];
    // application.value.model = application.value.model.split(":")[1];
  }
  application.value.isGroup=false;
  creating.value = true;
  aiStore
    .postMyApplication(
      application.value,
      createModelAvatar.value[0].file ? createModelAvatar.value[0].file : null
    )
    .then((res) => {
      emit("update:value", !modelDialog);
      if (props.toChat) aiStore.toUseApplication(res.data!);
    })
    .finally(() => (creating.value = false));
};
</script>

<template>
  <div>
    <n-modal
      style="width: 600px"
      :mask-closable="false"
      :show="modelDialog"
      preset="dialog"
      :title="application.showDetail ? '系统应用' : '自定义应用'"
      @update-show="emit('update:value', !modelDialog)"
    >
      <n-list :show-divider="false" id="personCreate" disabled>
        <n-list-item>
          <template #prefix> <div class="w-12">名称</div> </template>
          <n-thing>
            <span v-if="application.showDetail">{{ application.title }}</span>
            <n-input
              v-else
              v-model:value="application.title"
              placeholder="必填"
            ></n-input>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <template #prefix> <div class="w-12">头像</div> </template>
          <n-thing content-style="text-align: left;height:60px;cursor:pointer;">
            <div v-if="application.showDetail">
              <juavatar :src="application.avatar"></juavatar>
            </div>
            <n-upload
              v-else
              action="/"
              list-type="image-card"
              :default-upload="false"
              :max="1"
              :default-file-list="createModelAvatar"
              :on-before-upload="beforeUpload"
            >
              <!-- <n-avatar size="60" :src="defaultAvatar" />
              <svg-icon class="w-6 h-6" icon="raphael:arrowright2"></svg-icon> -->
            </n-upload>
          </n-thing>
        </n-list-item>
        <n-list-item>
          <template #prefix> <div class="w-12">AI模型</div> </template>
          <n-thing>
            <div v-if="application.showDetail">{{ application.model }}</div>
            <n-select
              v-else
              v-model:value="application.model"
              :options="
                aiStore.models.map((m) => {
                  return { value: m.modelId, label: m.name };
                })
              "
            />
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing>
            <template #description>
              <div class="flex justify-between">
                <div class="w-16">角色设定</div>

                <n-text
                  v-if="!application.showDetail"
                  @click="
                    aiStore.getChatExamplePrompts();
                    showCreateExample = !showCreateExample;
                  "
                  class="cursor-pointer"
                  type="success"
                >
                  示例
                </n-text>
              </div>
            </template>
            <div v-if="application.showDetail">{{ application.prompt }}</div>
            <n-input
              v-else
              v-model:value="application.prompt"
              rows="6"
              type="textarea"
            ></n-input>
            <n-drawer
              v-model:show="showCreateExample"
              :width="500"
              placement="right"
              :trap-focus="false"
              :block-scroll="false"
            >
              <n-list hoverable clickable>
                <n-list-item
                  @click="
                    showCreateExample = !showCreateExample;
                    application.prompt = item.prompt;
                  "
                  v-for="item in aiStore.examplePromptList"
                >
                  <n-thing :title="item.title" content-style="margin-top: 10px;">
                    <div class="line-clamp-4">{{ item.prompt }}</div>
                  </n-thing>
                </n-list-item>
              </n-list>
            </n-drawer>
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
              @click="emit('onShareDialog', application)"
              style="width: 35%"
              type="warning"
            >
              共 享
            </n-button>
            <n-button
              @click="
                aiStore.toUseApplication(application);
                emit('update:value', !modelDialog);
              "
              style="width: 60%"
              type="success"
            >
              使 用
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
