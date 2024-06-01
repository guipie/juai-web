<script setup lang="ts">
import { computed, ref } from "vue";
import { useAppStore } from "@/store/modules/app";
import HeaderBanner from "./modules/header-banner.vue";
import CardData from "./modules/card-data.vue";
// import PieChart from "./modules/pie-chart.vue";
import notices from "./modules/notices.vue";
// import CreativityBanner from './modules/creativity-banner.vue';
import { qianDao } from "@/service/api/user/jifen";
import { $t } from "@/locales";

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
const qiandaoLoading = ref(false);
const toQiandao = () => {
  qiandaoLoading.value = true;
  qianDao()
    .then((res) => window.$juMessage!(res.data))
    .finally(() => (qiandaoLoading.value = false));
};
</script>

<template>
  <NSpace vertical :size="16">
    <HeaderBanner />
    <CardData />
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:8">
        <NCard :bordered="false" class="card-wrapper h-full">
          <NThing title="每日签到送积分">
            <template #header-extra>
              <n-button type="success" @click="toQiandao" :loading="qiandaoLoading">
                {{ $t("page.home.signIn") }}
              </n-button>
            </template>
            <n-date-picker panel type="date" size="large" />
          </NThing>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:8">
        <NCard :bordered="false" class="card-wrapper h-full">
          <notices></notices>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:8">
        <NCard
          title="请扫码加入群聊，防止(你懂的)"
          :bordered="false"
          class="card-wrapper"
          style="height: 100%"
        >
          <!-- <LineChart /> -->
          <n-image :src="'https://oss.juai.link/juai/weixin.jpg?t=' + Date.now()" />
        </NCard>
      </NGi>
    </NGrid>
    <!-- <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid> -->
  </NSpace>
</template>

<style scoped></style>
./modules/notices.vue
