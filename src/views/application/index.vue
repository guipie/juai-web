<template>
  <div class="container">
    <n-card
      :bordered="false"
      title="应用订阅"
      style="margin-bottom: 16px"
      class="h-full lg:p-6 mx-auto"
    >
      <template #header-extra>
        <n-button type="success" @click="toCreateDialog">创建应用</n-button>
      </template>
      <n-tabs v-model:value="activeTab" type="line" animated defaultValue="one">
        <n-tab-pane :name="item" :tab="item" v-for="item in tags">
          <promptList :type="item"></promptList>
        </n-tab-pane>
        <n-tab-pane name="自定义" tab="自定义">
          <promptList
            ref="refAllPrompts"
            @on-create-dialog="toCreateDialog"
            :key="toCreateDialog.toString()"
            :type="'自定义'"
          ></promptList>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { NCard, NTabs, NTabPane, NButton } from "naive-ui";
import { nextTick, onMounted, ref, watch } from "vue";
import promptList from "@/components/application/promptList.vue";
import { useAICommonStore } from "@/store/modules/aicommon";
const aiStore = useAICommonStore();
const activeTab = ref("全部");
const tags = ref<string[]>([]);
const refAllPrompts = ref();
const toCreateDialog = () => {
  activeTab.value = "自定义";
  nextTick(() => (refAllPrompts.value.showCreate = true));
};
watch(
  () => aiStore.applications,
  () => {
    setTags();
  }
);
function setTags() {
  tags.value = [];
  let prompts = aiStore.applications.map((m) => m.tags);
  for (let index = 0; index < prompts.length; index++) {
    const element = prompts[index];
    if (element && element.split(",").length > 0 && !tags.value.includes(element))
      tags.value = [...tags.value, ...element.split(",")];
  }
  tags.value = [...["全部", "大模型"], ...tags.value];
}
onMounted(() => {
  aiStore.applicationInit();
  setTags();
});
</script>

<style lang="scss" scoped>
.n-card {
  background-color: rgb(var(--layout-bg-color) / var(--un-bg-opacity));
}
</style>
