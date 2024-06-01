<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { $t } from "@/locales";
import { useAppStore } from "@/store/modules/app";
import { useAuthStore } from "@/store/modules/auth";
import { getSysNoticeCount } from "@/service/api/home";

defineOptions({
  name: "HeaderBanner",
});

const appStore = useAppStore();
const authStore = useAuthStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface StatisticData {
  id: number;
  label: string;
  value: number;
}

const statisticData = ref<StatisticData[]>([
  {
    id: 2,
    label: $t("page.home.todo"),
    value: 0,
  },
  {
    id: 3,
    label: $t("page.home.message"),
    value: 0,
  },
]);
onMounted(() => {
  // getSysNoticeCount().then((res) => (statisticData.value[1].value = Number(res.data!)));
});
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:18">
        <div class="flex-y-center">
          <div class="size-72px shrink-0 overflow-hidden rd-1/2">
            <img src="@/assets/juai-1024.png" class="size-full" />
          </div>
          <div class="pl-12px">
            <h3 class="text-18px font-semibold">
              {{ $t("page.home.greeting", { userName: authStore.userInfo.nickName }) }}
            </h3>
            <p class="leading-30px text-#999">{{ $t('page.home.weatherDesc') }}</p>
          </div>
        </div>
      </NGi>
      <NGi span="24 s:24 m:6">
        <NSpace :size="24" justify="end">
          <NStatistic
            v-for="item in statisticData"
            :key="item.id"
            class="whitespace-nowrap text-center"
            v-bind="item"
          >
          </NStatistic>
        </NSpace>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
