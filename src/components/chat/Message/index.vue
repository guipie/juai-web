<script setup lang="ts">
import { computed, ref } from "vue";
import { NDropdown, useMessage } from "naive-ui";
import AvatarComponent from "./Avatar.vue";
import TextComponent from "./Text.vue";
import { useIconRender } from "@/hooks/useIconRender";
import { $t as t } from "@/locales";
import { useAppStore } from "@/store/modules/app";
import { copyToClip } from "@/utils/common";
import { useChatStore } from "@/store/modules/chat";
const appStore = useAppStore();
interface Props {
  chatDbId?: string;
  dateTime?: string;
  text?: string;
  inversion?: boolean;
  error?: boolean;
  loading?: boolean;
  model?: string;
}

interface Emit {
  (ev: "regenerate"): void;
  (ev: "delete"): void;
}

const props = defineProps<Props>();

const currentModel = useChatStore().getModelByModelId(props.model!);

const emit = defineEmits<Emit>();

const { isMobile } = appStore;

const { iconRender } = useIconRender();

const message = useMessage();

const textRef = ref<HTMLElement>();

const asRawText = ref(props.inversion);

const messageRef = ref<HTMLElement>();

const options = computed(() => {
  const common = [
    {
      label: t("chat.copy"),
      key: "copyText",
      icon: iconRender({ icon: "ri:file-copy-2-line" }),
    },
    {
      label: t("common.delete"),
      key: "delete",
      icon: iconRender({ icon: "ri:delete-bin-line" }),
    },
  ];

  if (!props.inversion) {
    common.unshift({
      label: asRawText.value ? t("chat.preview") : t("chat.showRawText"),
      key: "toggleRenderType",
      icon: iconRender({
        icon: asRawText.value ? "ic:outline-code-off" : "ic:outline-code",
      }),
    });
  }

  return common;
});

function handleSelect(key: "copyText" | "delete" | "toggleRenderType") {
  switch (key) {
    case "copyText":
      handleCopy();
      return;
    case "toggleRenderType":
      asRawText.value = !asRawText.value;
      return;
    case "delete":
      emit("delete");
  }
}

function handleRegenerate() {
  messageRef.value?.scrollIntoView();
  emit("regenerate");
}

async function handleCopy() {
  try {
    await copyToClip(props.text || "");
    message.success("复制成功");
  } catch {
    message.error("复制失败");
  }
}
</script>

<template>
  <div
    ref="messageRef"
    class="flex w-full mb-6 overflow-hidden"
    :class="[{ 'flex-row-reverse': inversion }]"
  >
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent
        :model="model"
        :model-avatar="currentModel?.avatarUrl"
        :image="inversion"
      />
    </div>
    <div
      class="overflow-hidden text-sm"
      :class="[inversion ? 'items-end' : 'items-start']"
    >
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <p>
        <n-text strong depth="3">
          {{ currentModel?.modelId }}
        </n-text>
      </p>
      <div
        class="flex items-end gap-1 mt-2"
        :class="[inversion ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        <div class="flex flex-col">
          <button
            v-if="!inversion && chatDbId"
            class="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="
              copyToClip('http://juai.link/chat/' + chatDbId, '去分享吧,已复制分享连接')
            "
          >
            <SvgIcon icon="ri:share-fill" />
          </button>
          <button
            v-if="!inversion"
            class="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="handleRegenerate"
          >
            <SvgIcon icon="ri:restart-line" />
          </button>
          <NDropdown
            :trigger="isMobile ? 'click' : 'hover'"
            :placement="!inversion ? 'right' : 'left'"
            :options="options"
            @select="handleSelect"
          >
            <button
              class="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <SvgIcon icon="ri:more-2-fill" />
            </button>
          </NDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
