<script setup lang="ts">
import { CSSProperties } from "vue";
import { computed, watch } from "vue";
import { NButton, NLayoutSider } from "naive-ui";
import { useChatStore } from "@/store/modules/chat";
import { useBasicLayout } from "@/hooks/useBasicLayout";

defineProps<{
  shareInfo: Chat.ShareInfo;
}>();
const chatStore = useChatStore();

const isMobile = useBasicLayout().isMobile;

const collapsed = computed(() => chatStore.siderCollapsed);
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
          <RouterLink to="/application">
            <NButton dashed style="width: 100%">
              更多分享
              <template #icon>
                <SvgIcon icon="ri:more-fill" />
              </template>
            </NButton>
          </RouterLink>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <n-list hoverable clickable>
            <n-list-item>
              <n-thing title="来至聚AI用户的分享" content-style="margin-top: 10px;">
                <!-- <template #description> </template> -->
                <div
                  class="border border-zinc-600 rounded p-2 text-sm text-zinc-600 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/10"
                >
                  <div class="flex">
                    <span>分享时间：</span>
                    <span>
                      {{ shareInfo.shareDetail.createTime }}
                    </span>
                  </div>
                  <div class="flex">
                    <span> 有 效 期：</span>
                    <span>
                      {{
                        shareInfo.shareDetail.effectiveDays > 0
                          ? shareInfo.shareDetail.effectiveDays + "天"
                          : "永久"
                      }}
                    </span>
                  </div>
                  <div class="flex">
                    <span> 限制人数：</span>
                    <span>
                      {{
                        shareInfo.shareDetail.accessPersonNum > 0
                          ? shareInfo.shareDetail.accessPersonNum + "人"
                          : "无限制"
                      }}
                    </span>
                  </div>
                  <div class="flex">
                    <span> 积分限制：</span>
                    <span>
                      {{
                        shareInfo.shareDetail.pointsLimit > 0
                          ? shareInfo.shareDetail.pointsLimit
                          : "无限制"
                      }}
                    </span>
                  </div>
                  <div class="flex">
                    <span> 已消耗积分：</span>
                    <span>
                      {{ shareInfo.shareDetail.pointsUsed }}
                    </span>
                  </div>
                </div>
              </n-thing>
            </n-list-item>
            <n-list-item>
              <n-thing
                :title="shareInfo.promptDetail?.title"
                content-style="margin-top: 10px;"
              >
                <template #description>
                  <n-space size="small" style="margin-top: 4px">
                    <n-tag :bordered="false" type="info" size="small">
                      {{ shareInfo.promptDetail?.model }}
                    </n-tag>
                    <n-tag :bordered="false" type="info" size="small">
                      {{ shareInfo.promptDetail?.tags }}
                    </n-tag>
                  </n-space>
                </template>
                <div class="text-neutral-500">{{ shareInfo.promptDetail?.prompt }}</div>
              </n-thing>
            </n-list-item>
          </n-list>
        </div>
      </main>
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
