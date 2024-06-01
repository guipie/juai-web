<template>
  <div class="relative mt-6 w-full overflow-x-auto">
    <n-layout embedded class="h-full" id="drawingLayout">
      <n-layout-header>
        <div class="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div class="flex justify-between space-x-2.5">
            <n-button text @click="router.back()">
              <template #icon>
                <svg-icon icon="material-symbols:arrow-back-ios-new"></svg-icon>
              </template>
            </n-button>
            <div class="flex items-center gap-2">
              {{ currentDrawing.name }}
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <n-tooltip placement="bottom" :style="{ maxWidth: '600px' }" trigger="hover">
              <template #trigger>
                <n-button text>
                  <template #icon>
                    <svg-icon
                      icon="material-symbols:indeterminate-question-box"
                    ></svg-icon>
                  </template>
                  <span class="hidden md:inline">说明</span>
                </n-button>
              </template>
              <span> {{ currentDrawing.desc }} </span>
            </n-tooltip>
            <n-button text>
              <template #icon>
                <svg-icon icon="fluent:draw-image-20-filled"></svg-icon>
              </template>
              <span class="hidden lg:inline">我的绘玩</span>
            </n-button>
          </div>
        </div>
      </n-layout-header>
      <n-layout id="drawingContentLayout" style="margin-top: 10px" class="h-full">
        <component
          @toFetchDrawing="toDrawing"
          :drawing="drawing"
          :defaultRequest="currentDrawing.request"
          :is="AsyncDrawingComponent"
        >
          <template #content>
            <n-tabs type="line" v-model:value="tabVal" animated>
              <n-tab-pane name="my" tab="我的绘画">
                <load-data
                  @load-data="toFetchMyDrawing"
                  :no-data-txt="'暂无我的' + currentDrawing.name + '绘画'"
                >
                  <div class="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                    <drawing-card
                      v-for="item in myDrawingData"
                      :drawing-response="item"
                      :key="item.id.toString()"
                      :drawing="item"
                    >
                      <template #footer>
                        <div class="m-4 text-right">
                          <NButton
                            v-if="
                              isMy(item.createUserId) &&
                              item.executionStatus == ExecutionStatuseEnum.failed
                            "
                            size="small"
                            style="pointer-events: visible"
                            type="warning"
                            @click="toRetryDrawing(item)"
                          >
                            重试
                          </NButton>
                          <!-- <NButton
                            type="success"
                            size="small"
                            style="pointer-events: visible"
                            @click="toUse(item)"
                          >
                            复制
                          </NButton> -->
                          <n-popconfirm
                            v-if="isMy(item.createUserId)"
                            class="float-right pl-14"
                            positive-text="确定删除"
                            @positive-click="toDelMyDrawing(item.id)"
                            negative-text="取消"
                          >
                            <template #trigger>
                              <NButton
                                type="error"
                                size="small"
                                style="pointer-events: visible"
                              >
                                删除
                              </NButton>
                            </template>
                            确定删除当前我的绘画？
                          </n-popconfirm>
                        </div>
                      </template>
                    </drawing-card>
                  </div>
                </load-data>
              </n-tab-pane>
              <n-tab-pane name="recommend" tab="推荐">
                <load-data
                  @load-data="toFetchDrawingRecommend"
                  :no-data-txt="'暂无推荐绘画'"
                >
                  <div class="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
                    <drawing-card
                      v-for="(item, index) in recommendDrawingData"
                      :drawing-response="item"
                      :key="index"
                      :drawing="item"
                    ></drawing-card>
                  </div>
                </load-data>
              </n-tab-pane>
            </n-tabs>
          </template>
        </component>
      </n-layout>
      <n-layout-footer style="position: absolute; bottom: 1px">
        请勿生成色情，反动等一系列违法绘画，一经发现直接封号。
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { useDrawingStore } from "@/store/modules/drawing";
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import Component404 from "@/views/_builtin/404/index.vue";
import { h } from "vue";
import { NSkeleton } from "naive-ui";
import {
  delMyDrawing,
  fetchDrawedImage,
  fetchDrawingRecommend,
  fetchMyDrawing,
} from "@/service/api/ai/drawing";
import { useAuthStore } from "@/store/modules/auth";
import { Drawing } from "@/typings/ai/drawing";
import { ExecutionStatuseEnum, DrawingTypeEnum } from "@/typings/enums/drawing-enum";
import { isMy } from "@/utils/validate/user";
import { mySignalR } from "@/utils/socket/signarR";
import {
  SocketMsgType,
  PublicClientMessage,
  ClientMessage,
} from "@/utils/socket/mySocket";

const route = useRoute();
const router = useRouter();
const drawingStore = useDrawingStore();
const drawing = ref(false);
const tabVal = ref("my");
const drawingType: DrawingTypeEnum = route.params.name as DrawingTypeEnum;
console.log("drawingType", drawingType);

const currentDrawing = ref<Drawing.Configuration>(
  drawingStore.configurations.findLast(
    (m: { drawingType: string }) => m.drawingType == drawingType
  )!
);
const recommendDrawingData = ref<Drawing.DrawingResponse[]>([]);
const myDrawingData = ref<Drawing.DrawingResponse[]>([]);

const AsyncDrawingComponent = defineAsyncComponent({
  loader: () => import(`./modules/${drawingType}.vue`),
  loadingComponent: h(NSkeleton, { text: true, repeat: 6 }, { default: () => "" }),
  errorComponent: Component404,
  delay: 200,
  timeout: 3000,
});
onMounted(() => {
  mySignalR.off(PublicClientMessage);
  mySignalR.on(PublicClientMessage, (msg: ClientMessage) => {
    console.log("PublicClientMessage", msg);
    if (msg.messageType == SocketMsgType.TaskDetail) {
      var data: Drawing.DrawingResponse = msg.data;
      var index = myDrawingData.value.findIndex((m) => m.id == data.id);
      if (index > -1) myDrawingData.value[index] = data;
      else myDrawingData.value.unshift(data);
    }
  });
});

function toFetchDrawingRecommend(callback: (data: any[], err?: any) => void) {
  fetchDrawingRecommend(drawingType)
    .then((res) => {
      console.log(res);
      recommendDrawingData.value = res.data ?? [];
      callback(recommendDrawingData.value);
    })
    .catch((err) => {
      callback([], err);
    });
}
function toFetchMyDrawing(callback: (data: any[], err?: any) => void) {
  if (useAuthStore().isLogin) {
    fetchMyDrawing(drawingType)
      .then((res) => {
        console.log(res);
        myDrawingData.value = res.data ?? [];
        callback(myDrawingData.value);
      })
      .catch((err) => {
        callback([], err);
      });
  }
}
function toDrawing(drawingModel: any, callback?: (data: any, err?: any) => void) {
  console.log("toFetchDrawing-root", drawingModel);
  drawing.value = true;
  fetchDrawedImage(drawingModel, currentDrawing.value.api)
    .then((res) => {
      console.log(res);
      if (
        res.data?.ossUrl ||
        Number(res.data?.executionStatus ?? 2) != ExecutionStatuseEnum.failed
      ) {
        window.$message?.success("生成成功");
        myDrawingData.value.unshift(res.data!);
      } else window.$message?.error("生成失败,请刷新后重试。");
      callback && callback(res.data!.id);
    })
    .finally(() => {
      drawing.value = false;
    });
}
function toRetryDrawing(item: any) {
  var retryReqeust = JSON.parse(item.requestParameters);
  toDrawing(retryReqeust);
}
// function toUse(item: any) {
//   var retryReqeust = JSON.parse(item.requestParameters);
//   currentDrawing.value.request = { ...currentDrawing.value.request, ...retryReqeust };
// }
function toDelMyDrawing(drawingId: bigint) {
  delMyDrawing(drawingId).then((res) => {
    console.log(res);

    res &&
      myDrawingData.value.splice(
        myDrawingData.value.findIndex((m) => m.id == drawingId),
        1
      );
  });
}
</script>

<style>
/*
.n-layout-header {
  background-color: rgb(var(--layout-bg-color) / var(--un-bg-opacity));
} */
.n-layout-sider {
  background-color: rgb(var(--layout-bg-color) / var(--un-bg-opacity));
}
.n-layout {
  background-color: rgb(var(--layout-bg-color) / var(--un-bg-opacity));
}
.n-layout-footer {
  background-color: rgb(var(--layout-bg-color) / var(--un-bg-opacity));
}
#drawingLayout .n-layout-scroll-container {
  overflow: hidden;
}
</style>
