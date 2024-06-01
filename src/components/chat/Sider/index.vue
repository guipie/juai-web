<script setup lang="ts">
import { CSSProperties, ref } from "vue";
import { computed, watch } from "vue";
import { NButton, NLayoutSider, useDialog, NSelect } from "naive-ui";
import List from "./List.vue";
import { useChatStore } from "@/store/modules/chat";
import { $t as t } from "@/locales";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useAICommonStore } from "@/store/modules/aicommon/index";
import { useIconRender } from "@/hooks/useIconRender";
import SvgIcon from '@/components/custom/svg-icon.vue'
import prompt from "@/components/application/prompt.vue";
import PromptGroup from "@/components/application/promptGroup.vue";

const chatStore = useChatStore();
const aiStore = useAICommonStore();
const dialog = useDialog();
const { iconRender } = useIconRender();
const isMobile = useBasicLayout().isMobile;

const collapsed = computed(() => chatStore.siderCollapsed);

function handleAdd() {
  chatStore.addHistory({ title: "New Chat", uuid: Date.now(), isEdit: false });
  if (isMobile.value) chatStore.setSiderCollapsed(true);
}

function handleUpdateCollapsed() {
  chatStore.setSiderCollapsed(!collapsed.value);
}
const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      // position: "fixed",
      zIndex: 50,
    };
  }
  return {};
});

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: "env(safe-area-inset-bottom)",
    };
  }
  return {};
});

watch(
  isMobile,
  (val) => {
    chatStore.setSiderCollapsed(val);
  },
  {
    immediate: true,
    flush: "post",
  }
);
const showCreate = ref(false);
const showCreateGroup = ref(false);
const application = ref<JuAI.ChatPrompt>();
const chatOptions = [
  {
    label: "随便聊聊",
    key: "chat",
    icon: iconRender({ icon: "mdi:message" }),
  },
  {
    label: "创建群聊",
    key: "chatGroup",
    icon: iconRender({ icon: "zondicons:conversation" }),
  },
  {
    label: "自定义聊天",
    key: "chatCustom",
    icon: iconRender({ icon: "teenyicons:message-text-alt-solid" }),
  },
  {
    label: "清空所有",
    key: "clearAll",
    icon: iconRender({ icon: "ooui:clear" }),
  },
];
function handleChatOptionsSelect(key: string | number) {
  switch (key) {
    case "chat":
      handleAdd();
      break;
    case "chatGroup":
      showCreateGroup.value = true;
      break;
    case "chatCustom":
      showCreate.value = true;
      break;
    case "clearAll":
      dialog.warning({
        title: t("chat.deleteMessage"),
        content: t("chat.clearHistoryConfirm"),
        positiveText: t("common.yesOrNo.yes"),
        negativeText: t("common.yesOrNo.yes"),
        onPositiveClick: () => {
          chatStore.clearHistory();
          if (isMobile.value) chatStore.setSiderCollapsed(true);
        },
      });
      break;
  }
}
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    :width="260"
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed style="width: 75%" @click="handleAdd">
            {{ $t("chat.newChatButton") }}
          </NButton>
          <n-dropdown
            trigger="click"
            :options="chatOptions"
            placement="bottom-start"
            @select="handleChatOptionsSelect"
          >
            <n-button dashed style="float: right">
              <template #icon>
                <SvgIcon icon="ion:more" />
              </template>
            </n-button>
          </n-dropdown>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
        <div
          class="flex items-center p-4 space-x-4"
          v-if="!chatStore.getIsPromptByCurrentActive"
        >
          <div class="flex-1">
            <n-select
              v-model:value="chatStore.currentModel"
              v-on:update:value="useAICommonStore().recordState"
              :options="
                aiStore.models?.map((m) => {
                  return { value: m.modelId, label: m.name };
                })
              "
            />
          </div>
        </div>
      </main>
      <prompt
        :value="showCreate"
        :prompt-model="application"
        :to-chat="true"
        @update:value="(val) => (showCreate = val)"
      ></prompt>
      <PromptGroup
        :value="showCreateGroup"
        :prompt-model="application"
        @update:value="(val) => (showCreateGroup = val)"
      ></PromptGroup>
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div
      v-show="!collapsed"
      class="fixed inset-0 z-40 w-full h-full bg-black/40"
      @click="handleUpdateCollapsed"
    />
  </template>
  <!-- <PromptStore v-model:visible="show" /> -->
</template>
<style>
#siderIcon .n-button .n-button__icon {
  margin-left: 3px;
}
</style>
