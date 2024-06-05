<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { NAutoComplete, NButton, NA, NInput, useDialog, useMessage } from "naive-ui";
import html2canvas from "html2canvas";
import { Message, HeaderComponent, HoverButton } from "@/components/chat";
import { useScroll } from "@/hooks/chat/useScroll";
import { useChat } from "@/hooks/chat/useChat";
import { useUsingContext } from "@/hooks/chat/useUsingContext";
import { $t as t } from "@/locales";
import { useChatStore } from "@/store/modules/chat";
import { fetchChatAPIProcess } from "@/service/api/ai/chat";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/modules/auth";
import { getGUID } from "@/utils/common";
let controller = new AbortController();
const dialog = useDialog();
const ms = useMessage();
const chatStore = useChatStore();
const route = useRoute();
const { isMobile } = useBasicLayout();
const { addChat, updateChatById, getChatByUuid } = useChat();
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll();
const { usingContext, usingAsyncDb, toggleUsingAsyncDb } = useUsingContext();

let uuid = Number(route.query.uuid?.toString());
chatStore.reloadRoute(uuid);
const dataSources = ref(chatStore.getChatDataByUuid(uuid));

const currentChat = ref(chatStore.getConversationByUuid(uuid));
watch(
  () => route.query.uuid,
  () => {
    uuid = Number(route.query.uuid);
    currentChat.value = chatStore.getConversationByUuid(Number(route.query.uuid));
    dataSources.value = chatStore.getChatDataByUuid(uuid);
  }
);
const prompt = ref<string>("");
const loading = ref<boolean>(false);
const inputRef = ref<Ref | null>(null);

function handleSubmit() {
  if (currentChat.value?.chatPrompt?.isGroup) {
    let models = currentChat.value?.chatPrompt.promptExtend.split(":");
    for (let index = 0; index < models.length; index++) {
      console.log(models[index]);
      onConversation(models[index], true, index == 0);
      if (index == models.length - 1) prompt.value = "";
    }
  } else onConversation(currentChat.value!.model.name);
}

async function onConversation(model: string, isGroup = false, groupFirst = true) {
  let message = prompt.value;

  if (loading.value && !model) return;

  if (!message || message.trim() === "") return;

  controller = new AbortController();
  if ((isGroup && groupFirst) || !isGroup)
    addChat(+uuid, {
      id: getGUID(),
      dateTime: new Date().toLocaleString(),
      text: message,
      reqText: message,
      inversion: true,
      error: false,
      model: model,
    });
  scrollToBottom();
  loading.value = true;
  const answerId = getGUID();
  if (!isGroup) prompt.value = "";
  addChat(+uuid, {
    id: answerId,
    dateTime: new Date().toLocaleString(),
    text: "思考中",
    reqText: message,
    loading: true,
    inversion: false,
    error: false,
    model: model,
  });
  scrollToBottom();

  try {
    let lastText = "";
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>(
        uuid,
        message,
        +uuid,
        null,
        { model: model, isGroup },
        controller.signal,
        ({ event }) => {
          const xhr = event.target;
          const { responseText } = xhr;
          console.log(responseText);
          // Always process the final line
          const lastIndex = responseText.lastIndexOf("\n", responseText.length - 2);
          let chunk = responseText;
          if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
          try {
            const data = JSON.parse(chunk);
            updateChatById(+uuid, {
              id: answerId,
              chatDbId: data.chatDbId,
              dateTime: new Date().toLocaleString(),
              text: lastText + (data.text ?? ""),
              reqText: message,
              inversion: false,
              error: false,
              loading: true,
            });
            scrollToBottomIfAtBottom();
          } catch (error) {
            console.log("出错了", error);
          }
        }
      );
      updateChatById(+uuid, {
        id: answerId,
        loading: false,
      });
    };
    await fetchChatAPIOnce();
  } catch (error: any) {
    console.log(error);
    const errorMessage = error?.message ?? t("common.wrong");
    if (error.message === "canceled") {
      updateChatById(+uuid, {
        id: answerId,
        loading: false,
      });
      scrollToBottomIfAtBottom();
      return;
    }

    const currentChat = getChatByUuid(+uuid, answerId);

    if (currentChat?.text && currentChat.text !== "") {
      updateChatById(+uuid, {
        id: answerId,
        text: `${currentChat.text}\n[${errorMessage}]`,
        error: false,
        loading: false,
      });
      return;
    }
    updateChatById(+uuid, {
      id: answerId,
      dateTime: new Date().toLocaleString(),
      text: errorMessage,
      reqText: message,
      inversion: false,
      error: true,
      loading: false,
    });
    scrollToBottom();
  } finally {
    loading.value = false;
  }
}

async function onRegenerate(index: number) {
  if (loading.value) return;

  controller = new AbortController();
  const currentReq = dataSources.value[index];
  loading.value = true;
  updateChatById(+uuid, {
    id: currentReq.id,
    chatDbId: currentReq.chatDbId,
    dateTime: new Date().toLocaleString(),
    text: "重新回答中..",
    reqText: currentReq.reqText,
    inversion: false,
    error: false,
    loading: true,
    model: currentReq.model,
  });
  try {
    let lastText = "";
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>(
        uuid,
        currentReq.reqText,
        +uuid,
        currentReq.chatDbId!,
        { model: currentReq.model, isGroup: false },
        controller.signal,
        ({ event }) => {
          const xhr = event.target;
          const { responseText } = xhr;
          console.log(responseText);
          // Always process the final line
          const lastIndex = responseText.lastIndexOf("\n", responseText.length - 2);
          let chunk = responseText;
          if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
          try {
            const data = JSON.parse(chunk);
            updateChatById(+uuid, {
              id: currentReq.id,
              chatDbId: data.chatDbId,
              dateTime: new Date().toLocaleString(),
              text: lastText + (data.text ?? ""),
              reqText: currentReq.reqText,
              inversion: false,
              error: false,
              loading: true,
              model: currentReq.model,
            });
          } catch (error) {
            console.log("出错了", error);
          }
        }
      );
      updateChatById(+uuid, { id: currentReq.id, loading: false });
    };
    await fetchChatAPIOnce();
  } catch (error: any) {
    if (error.message === "canceled") {
      updateChatById(+uuid, { id: currentReq.id, loading: false });
      return;
    }
    const errorMessage = error?.message ?? t("common.wrong");
    updateChatById(+uuid, {
      id: currentReq.id,
      dateTime: new Date().toLocaleString(),
      text: errorMessage,
      reqText: currentReq.reqText,
      inversion: false,
      error: true,
      loading: false,
    });
  } finally {
    loading.value = false;
  }
}

function handleExport() {
  if (loading.value) return;

  const d = dialog.warning({
    title: t("chat.exportImage"),
    content: t("chat.exportImageConfirm"),
    positiveText: t("common.yesOrNo.yes"),
    negativeText: t("common.yesOrNo.no"),
    onPositiveClick: async () => {
      try {
        d.loading = true;
        const ele = document.getElementById("image-wrapper");
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        });
        const imgUrl = canvas.toDataURL("image/png");
        const tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = imgUrl;
        tempLink.setAttribute("download", "chat-shot.png");
        if (typeof tempLink.download === "undefined")
          tempLink.setAttribute("target", "_blank");

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(imgUrl);
        d.loading = false;
        ms.success(t("chat.exportSuccess"));
        Promise.resolve();
      } catch (error: any) {
        ms.error(t("chat.exportFailed"));
      } finally {
        d.loading = false;
      }
    },
  });
}

function handleDelete(index: number) {
  if (loading.value) return;

  dialog.warning({
    title: t("chat.deleteMessage"),
    content: t("chat.deleteMessageConfirm"),
    positiveText: t("common.yesOrNo.yes"),
    negativeText: t("common.yesOrNo.no"),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(+uuid, index);
    },
  });
}

function handleClear() {
  if (loading.value) return;

  dialog.warning({
    title: t("chat.clearChat"),
    content: t("chat.clearChatConfirm"),
    positiveText: t("common.yesOrNo.yes"),
    negativeText: t("common.yesOrNo.no"),
    onPositiveClick: () => {
      chatStore.deleteConversation(+uuid);
    },
  });
}
function handleNetwork() {
  window.$message?.info("暂不对外开放");
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  } else {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort();
    loading.value = false;
  }
}

const placeholder = computed(() => {
  if (isMobile.value) return t("chat.placeholderMobile");
  return t("chat.placeholder");
});

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === "";
});

const footerClass = computed(() => {
  let classes = ["p-4"];
  if (isMobile.value)
    classes = [
      "sticky",
      "left-0",
      "bottom-0",
      "right-0",
      "p-2",
      "pr-3",
      "overflow-hidden",
    ];
  return classes;
});

const getContainerClass = computed(() => {
  return ["h-full", { "pl-[320px]": !isMobile.value && !collapsed.value }];
});
const collapsed = computed(() => chatStore.siderCollapsed);
onMounted(() => {
  scrollToBottom();
  if (inputRef.value && !isMobile.value) inputRef.value?.focus();
  chatStore.chatInit();
});

onUnmounted(() => {
  if (loading.value) controller.abort();
});
</script>

<template>
  <div class="flex-1 h-full transition-all bg-container">
    <div class="h-full overflow-hidden">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider :cur-conversion="currentChat" v-if="currentChat" />
        <NLayoutContent class="h-full">
          <div class="flex flex-col w-full h-full">
            <HeaderComponent
              v-if="isMobile"
              :using-context="usingContext"
              @export="handleExport"
              @handle-clear="handleClear"
            />
            <main class="flex-1 overflow-hidden">
              <div
                id="scrollRef"
                ref="scrollRef"
                class="h-full overflow-hidden overflow-y-auto"
              >
                <div
                  id="image-wrapper"
                  class="w-full m-auto"
                  :class="[isMobile ? 'p-0' : 'p-4']"
                >
                  <template v-if="!dataSources.length">
                    <div class="flex items-center justify-center mt-4 text-neutral-400">
                      <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
                      <span
                        style="white-space: pre-wrap"
                        v-if="currentChat?.chatPrompt?.initMessage"
                      >
                        {{ currentChat?.chatPrompt?.initMessage }}
                      </span>
                      <span v-else>
                        欢迎使用聚AI，更多精彩持续升级中~
                        <n-a href="http://juai.link/feedback?t=need" target="_blank">
                          反馈需求
                        </n-a>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <Message
                        v-for="(item, index) of dataSources"
                        :key="index"
                        :date-time="item.dateTime"
                        :text="item.text"
                        :inversion="item.inversion"
                        :chatModel="item.model"
                        :error="item.error"
                        :loading="item.loading"
                        :chat-db-id="item.chatDbId?.toString()"
                        @regenerate="onRegenerate(index)"
                        @delete="handleDelete(index)"
                      />
                      <div class="sticky bottom-0 left-0 flex justify-center">
                        <NButton v-if="loading" type="warning" @click="handleStop">
                          <template #icon>
                            <SvgIcon icon="ri:stop-circle-line" />
                          </template>
                          {{ t("common.stopResponding") }}
                        </NButton>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </main>
            <footer :class="footerClass">
              <div class="w-full max-w-screen-xl m-auto">
                <div class="flex items-center justify-between space-x-2">
                  <HoverButton
                    v-if="!isMobile && useAuthStore().userInfo.phone == '18600766045'"
                    :checked="usingAsyncDb"
                    @click="toggleUsingAsyncDb"
                  >
                    <span
                      class="text-xl text-[#4f555e] dark:text-white"
                      :class="{
                        'text-[#4b9e5f]': usingAsyncDb,
                        'text-[#4f555e]': !usingAsyncDb,
                      }"
                    >
                      <SvgIcon icon="iconoir:database-backup" />
                    </span>
                  </HoverButton>
                  <HoverButton :checked="false" v-if="!isMobile" @click="handleNetwork">
                    <span class="text-xl text-[#4f555e] dark:text-white">
                      <SvgIcon icon="zondicons:network" />
                    </span>
                  </HoverButton>
                  <HoverButton v-if="!isMobile" @click="handleClear">
                    <span class="text-xl text-[#4f555e] dark:text-white">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </span>
                  </HoverButton>
                  <HoverButton v-if="!isMobile" @click="handleExport">
                    <span class="text-xl text-[#4f555e] dark:text-white">
                      <SvgIcon icon="ri:download-2-line" />
                    </span>
                  </HoverButton>
                  <!-- <HoverButton :checked="usingContext" @click="toggleUsingContext">
                    <span
                      class="text-xl text-[#a8071a]"
                      :class="{
                        'text-[#4b9e5f]': usingContext,
                      }"
                    >
                      <SvgIcon icon="ri:chat-history-line" />
                    </span>
                  </HoverButton> -->
                  <NAutoComplete v-model:value="prompt">
                    <template #default="{ handleInput, handleBlur, handleFocus }">
                      <NInput
                        ref="inputRef"
                        v-model:value="prompt"
                        type="textarea"
                        :placeholder="placeholder"
                        :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                        @input="handleInput"
                        @focus="handleFocus"
                        @blur="handleBlur"
                        @keypress="handleEnter"
                      />
                    </template>
                  </NAutoComplete>
                  <NButton
                    type="primary"
                    :disabled="buttonDisabled"
                    @click="handleSubmit"
                  >
                    <template #icon>
                      <span class="dark:text-black">
                        <SvgIcon icon="ri:send-plane-fill" />
                      </span>
                    </template>
                  </NButton>
                </div>
              </div>
            </footer>
          </div>
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>
