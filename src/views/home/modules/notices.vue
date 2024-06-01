<script setup lang="ts">
import { $t } from "@/locales";
import { getNotices } from "@/service/api/home";
import { onMounted, ref } from "vue";

defineOptions({
  name: "Notices",
});
let notices = ref<any[]>([]);
let page = ref(1);
onMounted(() => {
  GetNotices();
});
function GetNotices() {
  getNotices(page.value).then((res) => {
    notices.value = res.data;
  });
}
</script>

<template>
  <NCard
    :title="$t('page.home.notice')"
    :bordered="false"
    size="small"
    segmented
    class="card-wrapper"
  >
    <template #header-extra v-if="notices.length < 5">
      <a
        class="text-primary"
        href="javascript:;"
        @click="
          page++;
          GetNotices();
        "
      >
        {{ $t("page.home.nextPage") }}
      </a>
    </template>
    <n-empty description="暂无通知消息" v-if="notices.length === 0"> </n-empty>
    <NList hoverable clickable>
      <NListItem v-for="item in notices" :key="item.id">
        <template #prefix>
          <SoybeanAvatar class="size-36px!" />
        </template>
        <NThing :title="item.title">
          <div class="line-clamp-1">{{ item.content }}</div>
          <template #header-extra>
            <div class="op30 text-sm-1">
              {{ item.publicTime }}
            </div>
          </template>
        </NThing>
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
