<script setup lang="ts">
import { computed, ref } from "vue";
import { NInput, NPopconfirm, NScrollbar } from "naive-ui";
import SvgIcon from "@/components/custom/svg-icon.vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { debounce } from "@/utils/common";
import { useChatStore } from "@/store/modules/chat";
import juavatar from "@/components/custom/juavatar.vue";
import prompt from "@/components/application/prompt.vue";
import { useRouter } from "vue-router";
const { isMobile } = useBasicLayout();

const chatStore = useChatStore();
const router = useRouter();
const dataSources = computed(() => chatStore.conversations);
// const props = defineProps({
//   curConversation: { type: Object as PropType<Chat.Conversation>, required: true },
// });
// const curChat = computed(() => props.curConversation);
async function handleSelect({ uuid }: Chat.Conversation) {
  // if (isActive(uuid)) return;
  chatStore.reloadRoute(uuid);
  // if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  // await chatStore.setActive(uuid);

  // if (isMobile.value) chatStore.setSiderCollapsed(true);
}

function handleEdit(
  { uuid, chatPrompt }: Chat.Conversation,
  isEdit: boolean,
  event?: MouseEvent
) {
  event?.stopPropagation();
  if (chatPrompt?.id && chatPrompt.id > 0 && !chatPrompt.isGroup) {
    showCreate.value = true;
    application.value = chatPrompt;
    application.value.showDetail = true;
  } else {
    chatStore.updateConversationByUuid(uuid, { isEdit });
  }
}

function handleDelete(uuid: number, index: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation();
  chatStore.deleteConversation(uuid);
  if (isMobile.value) chatStore.setSiderCollapsed(true);
}

const handleDeleteDebounce = debounce(handleDelete, 600);

function handleEnter({ uuid }: Chat.Conversation, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation();
  if (event.key === "Enter") chatStore.updateConversationByUuid(uuid, { isEdit });
}

// function isActive(uuid: number) {
//   return chatStore.active === uuid;
// }
const curUuid = computed(() => Number(router.currentRoute.value.query.uuid));
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
</script>
<template>
  <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t("common.noData") }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="item.uuid">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="
              item.uuid == curUuid && [
                'border-[#4b9e5f]',
                'bg-neutral-100',
                'text-[#4b9e5f]',
                'dark:bg-[#24272e]',
                'dark:border-[#4b9e5f]',
                'pr-14',
              ]
            "
            @click="handleSelect(item)"
          >
            <n-text
              v-if="item.chatPrompt?.isGroup"
              type="warning"
              style="position: absolute; top: 2px; right: 4px"
            >
              群聊
            </n-text>
            <span v-if="item.chatPrompt?.type">
              <juavatar
                :key="item.uuid"
                :size="36"
                :src="item.chatPrompt.avatar"
              ></juavatar>
            </span>
            <span v-else>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden">
              <NInput
                v-if="item.isEdit"
                v-model:value="item.name"
                size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <div v-else>
                <span class="break-all whitespace-nowrap">
                  {{ item.name }}
                </span>
                <div class="text-[#b4bbc4] text-12px line-clamp-2">
                  {{ item.chatPrompt?.prompt }}
                </div>
              </div>
            </div>
            <div v-if="curUuid == item.uuid" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1" @click="handleEdit(item, true, $event)">
                  <SvgIcon
                    :icon="
                      item.chatPrompt?.id && !item.chatPrompt.isGroup
                        ? 'ri:share-fill'
                        : 'ri:edit-line'
                    "
                  />
                </button>
                <NPopconfirm
                  placement="bottom"
                  @positive-click="handleDeleteDebounce(item.uuid, index, $event)"
                >
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </button>
                  </template>
                  {{ $t("chat.deleteHistoryConfirm") }}
                </NPopconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>

      <prompt
        :value="showCreate"
        :key="application?.id?.toString()"
        :prompt-model="application"
        @update:value="(val) => (showCreate = val)"
        @on-share-dialog="toShareDialog"
      ></prompt>

      <share
        :value="showShare"
        :application-id="showShareId"
        :application-title="showShareTitle"
        @update:value="(val) => (showShare = val)"
      ></share>
    </div>
  </NScrollbar>
</template>
