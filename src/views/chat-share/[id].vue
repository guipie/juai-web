<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { NAutoComplete, NButton, NA, NInput, useDialog, useMessage } from "naive-ui";
import html2canvas from "html2canvas";
import { Message, HeaderComponent, HoverButton } from "@/components/chat";
import { useScroll } from "@/hooks/chat/useScroll";
import { useChat } from "@/hooks/chat/useChat";
import { $t as t } from "@/locales";
import { useChatStore } from "@/store/modules/chat";
import { fetchChatAPIProcess, fetchShareChatDetail } from "@/service/api/ai/chat";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useRouter } from "vue-router";
import { useUsingContext } from "@/hooks/chat/useUsingContext";
import { useAICommonStore } from "@/store/modules/aicommon";
let controller = new AbortController();
const dialog = useDialog();
const ms = useMessage();
const router = useRouter();
const chatStore = useChatStore();
const { isMobile } = useBasicLayout();
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat();
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll();
const { usingShareContext, toggleShareUsingContext } = useUsingContext();
console.log(router.currentRoute.value.query.s, router.currentRoute.value.params.id);

let uuid = Number(router.currentRoute.value.params.id);
const pwd = ref(router.currentRoute.value.query.s?.toString());
const dataSources = computed(() => chatStore.getChatByUuid(+uuid));
const prompt = ref<string>("");
const loading = ref<boolean>(false);
const inputRef = ref<Ref | null>(null);

// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading) updateChatSome(+uuid, index, { loading: false });
});

function handleSubmit() {
  onConversation();
}

async function onConversation() {
  let message = prompt.value;

  if (loading.value) return;

  if (!message || message.trim() === "") return;

  controller = new AbortController();

  addChat(+uuid, {
    dateTime: new Date().toLocaleString(),
    text: message,
    reqText: message,
    inversion: true,
    error: false,
  });
  scrollToBottom();
  loading.value = true;
  prompt.value = "";
  addChat(+uuid, {
    dateTime: new Date().toLocaleString(),
    text: "思考中",
    reqText: message,
    loading: true,
    inversion: false,
    error: false,
  });
  scrollToBottom();

  try {
    let lastText = "";
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>(
        message,
        +uuid,
        null,
        "share",
        controller.signal,
        ({ event }) => {
          const xhr = event.target;
          const { responseText } = xhr;
          // Always process the final line
          const lastIndex = responseText.lastIndexOf("\n", responseText.length - 2);
          let chunk = responseText;
          if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
          try {
            const data = JSON.parse(chunk);
            console.log(data);
            updateChat(+uuid, dataSources.value.length - 1, {
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
        },
        {
          headers: {
            share: "1",
            num: shareInfo.value.shareDetail.numUrl,
            pwd: shareInfo.value.shareDetail.pwd,
          },
          model: shareInfo.value.shareDetail.model,
        }
      );
      updateChatSome(+uuid, dataSources.value.length - 1, { loading: false });
    };

    await fetchChatAPIOnce();
  } catch (error: any) {
    console.log(error);
    const errorMessage = error?.message ?? t("common.wrong");
    if (error.message === "canceled") {
      updateChatSome(+uuid, dataSources.value.length - 1, {
        loading: false,
      });
      scrollToBottomIfAtBottom();
      return;
    }

    const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1);

    if (currentChat?.text && currentChat.text !== "") {
      updateChatSome(+uuid, dataSources.value.length - 1, {
        text: `${currentChat.text}\n[${errorMessage}]`,
        error: false,
        loading: false,
      });
      return;
    }
    updateChat(+uuid, dataSources.value.length - 1, {
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
  debugger;
  if (loading.value) return;

  controller = new AbortController();
  const currentReq = dataSources.value[index];
  loading.value = true;

  updateChat(+uuid, index, {
    chatDbId: currentReq.chatDbId,
    dateTime: new Date().toLocaleString(),
    text: "重新回答中..",
    reqText: currentReq.reqText,
    inversion: false,
    error: false,
    loading: true,
  });

  try {
    let lastText = "";
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>(
        currentReq.reqText,
        +uuid,
        currentReq.chatDbId!,
        "share",
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
            updateChat(+uuid, index, {
              chatDbId: data.chatDbId,
              dateTime: new Date().toLocaleString(),
              text: lastText + (data.text ?? ""),
              reqText: currentReq.reqText,
              inversion: false,
              error: false,
              loading: true,
            });
          } catch (error) {
            console.log("出错了", error);
          }
        },
        {
          headers: {
            share: "1",
            num: shareInfo.value.shareDetail.numUrl,
            pwd: shareInfo.value.shareDetail.pwd,
          },
          model: shareInfo.value.shareDetail.model,
        }
      );
      updateChatSome(+uuid, index, { loading: false });
    };
    await fetchChatAPIOnce();
  } catch (error: any) {
    if (error.message === "canceled") {
      updateChatSome(+uuid, index, {
        loading: false,
      });
      return;
    }
    const errorMessage = error?.message ?? t("common.wrong");

    updateChat(+uuid, index, {
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
      chatStore.clearChatByUuid(+uuid);
    },
  });
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
  return ["h-full", { "pl-[290px]": !isMobile.value && !collapsed.value }];
});
const collapsed = computed(() => chatStore.siderCollapsed);
const shareInfo = ref<Chat.ShareInfo>({ code: 0 });
const shareLoading = ref(false);
onMounted(() => {
  scrollToBottom();
  if (inputRef.value && !isMobile.value) inputRef.value?.focus();
  getDetall();
  useAICommonStore().getModels();
});
const getDetall = () => {
  shareLoading.value = true;
  fetchShareChatDetail(uuid, pwd.value)
    .then((res) => {
      shareInfo.value = res.data!;
      chatStore.addHistory(
        {
          title: shareInfo.value.promptDetail!.title,
          uuid: shareInfo.value.shareDetail.numUrl,
          isEdit: false,
          isShare: true,
        },
        [],
        shareInfo.value.promptDetail
      );
    })
    .finally(() => (shareLoading.value = false));
};
onUnmounted(() => {
  if (loading.value) controller.abort();
});
</script>

<template>
  <n-spin
    size="large"
    style="height: 100%"
    :show="shareLoading || shareInfo.code != 0"
    :delay="1000"
    :rotate="false"
  >
    <template #description v-if="shareLoading"> 验证中.. </template>
    <template #description v-else>
      <div class="flex justify-between">
        <NText type="warning" size="small">{{ shareInfo.message }}</NText>
        <n-button text tag="a" href="/" type="primary"> 更多分享 </n-button>
      </div>
      <n-input-group>
        <n-input v-model:value="pwd" placeholder="请输入正确验证码" />
        <n-button type="primary" @click="getDetall"> 进 入 </n-button>
      </n-input-group>
    </template>
    <template #icon v-if="!shareLoading">
      <!-- <NText type="warning"><SvgIcon icon="mingcute:warning-fill"></SvgIcon></NText> -->
    </template>
    <div class="flex-1 h-full transition-all bg-container">
      <div class="h-full overflow-hidden">
        <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
          <SiderShare v-if="shareInfo.promptDetail" :share-info="shareInfo"></SiderShare>
          <NLayoutContent class="h-full">
            <div class="flex flex-col w-full h-full">
              <HeaderComponent
                v-if="isMobile"
                :using-context="usingShareContext"
                :title="shareInfo.promptDetail!.title"
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
                      <div class="flex items-center justify-center mt-4 text-neutral-600">
                        <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
                        <span style="white-space: pre-wrap" v-if="shareInfo.promptDetail">
                          {{ shareInfo.promptDetail.initMessage }}
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
                          :error="item.error"
                          :loading="item.loading"
                          :chat-db-id="item.chatDbId?.toString()"
                          @regenerate="onRegenerate(index)"
                          @delete="handleDelete(index)"
                          :model-avatar="
                            chatStore.getChatHistoryByCurrentActive?.chatPrompt?.avatar
                          "
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
                    <HoverButton @click="toggleShareUsingContext">
                      <span
                        class="text-xl"
                        :class="{
                          'text-[#4b9e5f]': usingShareContext,
                          'text-[#a8071a]': !usingShareContext,
                        }"
                      >
                        <SvgIcon icon="ri:chat-history-line" />
                      </span>
                    </HoverButton>
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
  </n-spin>
</template>
<style>
.n-spin-content {
  height: 100%;
}
</style>
