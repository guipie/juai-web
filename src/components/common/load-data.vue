<template>
  <div>
    <div v-if="loading">
      <n-skeleton text :repeat="3" /> <n-skeleton text style="width: 60%" />
    </div>
    <div v-else>
      <slot></slot>
      <n-empty v-if="data.length == 0" :description="noDataTxt">
        <template #extra>
          <slot name="nodata"></slot>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
const props = defineProps({
  loadRequest: Object,
  noDataTxt: {
    type: String,
    default: () => "暂无数据",
  },
});
const myEmit = defineEmits(["loadData"]);
const loading = ref(true);
const data = ref<any[]>([]);
const isError = ref(false);
onMounted(() => {
  myEmit("loadData", (result: any[], err: any) => {
    loading.value = false;
    data.value = result;
    isError.value = !!err;
  });
});
</script>

<style scoped></style>
