<script setup lang="ts">
import { onMounted, ref } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { $t } from "@/locales";
import { getMyStatistics } from "@/service/api/home/index";

defineOptions({
  name: "CardData",
});

interface CardData {
  key: string;
  title: string;
  value: number;
  router: string;
  color: {
    start: string;
    end: string;
  };
  icon: string;
}

const cardData = ref<CardData[]>([
  {
    key: "chatCount",
    title: $t("page.home.chatCount"),
    value: 0,
    color: {
      start: "#ec4786",
      end: "#b955a4",
    },
    router: "/chat",
    icon: "material-symbols:chat-bubble",
  },
  {
    key: "drawingCount",
    title: $t("page.home.drawingCount"),
    value: 0,
    color: {
      start: "#865ec0",
      end: "#5144b4",
    },
    router: "/drawing",
    icon: "fluent:draw-image-20-filled",
  },
  {
    key: "jifenCount",
    title: $t("page.home.pointsBalance"),
    value: 0,
    color: {
      start: "#56cdf3",
      end: "#719de3",
    },
    router: "https://juai.link/my/profile",
    icon: "material-symbols:account-balance-rounded",
  },
  {
    key: "visitCount",
    title: $t("page.home.invitedPeoples"),
    value: 0,
    color: {
      start: "#fcbc25",
      end: "#f68057",
    },
    router: "/invite/user",
    icon: "mingcute:invite-fill",
  },
]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData["color"]) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
onMounted(() => {
  getMyStatistics().then((m) => {
    for (const key in m.data) {
      let index = cardData.value.findIndex((m) => m.key == key);
      if (index > -1) {
        cardData.value[index].value = m.data[key];
      }
    }
  });
});
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div
        class="px-16px pt-8px pb-4px rd-8px text-white"
        :style="{ backgroundImage: gradientColor }"
      >
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key">
        <JuLink :to="item.router">
          <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
            <h3 class="text-16px">{{ item.title }}</h3>
            <div class="flex justify-between pt-12px">
              <SvgIcon :icon="item.icon" class="text-32px" />
              <CountTo
                :start-value="1"
                :end-value="item.value"
                class="text-30px text-white "
              />
            </div>
          </GradientBg>
        </JuLink>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
