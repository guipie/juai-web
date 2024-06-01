<template>
  <div class="container">
    <div class="grid grid-cols-1 py-3 gap-2 px-4">
      <div class="flex">
        <div class="flex-none w-24"><n-text>我的邀请码：</n-text></div>
        <div class="flex-initial">
          <n-input-group>
            <NInput :value="inviteCode" disabled> </NInput>
            <NButton @click="copyToClip(inviteCode)">复 制</NButton>
          </n-input-group>
        </div>
      </div>
      <div class="flex">
        <div class="flex-none w-24"><n-text>邀 请 链 接：</n-text></div>
        <div class="flex-initial">
          <n-input-group>
            <n-input disabled :value="'juai.link?u=' + inviteCode"> </n-input>
            <NButton @click="copyToClip('juai.link?u=' + inviteCode)"> 复 制 </NButton>
          </n-input-group>
        </div>
      </div>
      <div class="flex">
        <div class="flex-none w-24"><n-text>邀请总人数：</n-text></div>
        <div class="flex-initial">
          <n-text size="large" type="warning">{{ total }} 人</n-text>
        </div>
      </div>
    </div>
    <n-card :bordered="false" style="border-radius: 0px;" shadow="hover" title="邀请积分记录">
      <template #header-extra>
        <n-text type="warning" size="small"> 累计邀请100付费用户永久免费 </n-text>
      </template>
      <NDataTable
        :loading="loading == 'loading'"
        :data="inviteUsers"
        :columns="[
          {
            title: '序号',
            key: 'index',
            render: (_:any, index:number) => {
              return `${index + 1}`;
            },
          },
          {
            title: '邀请时间',
            key: 'createTime',
          },
          {
            title: '获取积分',
            key: 'addNum',
          },
          {
            title: '邀请用户',
            key: 'extend',
          },
        ]"
        style="width: 100%"
        stripe
      >
      </NDataTable>
      <n-pagination
        class="pt-4"
        hide-on-single-page
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { NInput } from "naive-ui";
import { onMounted, ref } from "vue";
import { getInviteCode, getInviteUsers } from "@/service/api/user/invite";
import { copyToClip } from "@/utils/common";

const loading = ref<JuApp.LoadStatus>();
const inviteUsers = ref<any[]>([]);
const inviteCode = ref("");
const size = 10;
const page = 1;
const total = ref(0);
onMounted(() => {
  getInviteCode().then((res) => (inviteCode.value = res.data!));
  loadMore();
});
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const loadMore = () => {
  loading.value = "loading";
  getInviteUsers(page, size)
    .then((res) => {
      total.value = res.data!.total;
      inviteUsers.value = res.data!.items;
      loading.value = res.data!.items.length >= size ? "load" : "nomore";
    })
    .catch((err) => (loading.value = "error"));
};
</script>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
