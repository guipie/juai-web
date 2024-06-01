<script setup lang="ts">
import { createTextVNode, defineComponent } from "vue";
import { useDialog, useLoadingBar, useMessage, useNotification } from "naive-ui";
defineOptions({
  name: "AppProvider",
});

const ContextHolder = defineComponent({
  name: "ContextHolder",
  setup() {
    const useMsg = useMessage();
    function register() {
      window.$loadingBar = useLoadingBar();
      window.$dialog = useDialog();
      window.$message = useMessage();
      window.$notification = useNotification();
      window.$juMessage = (
        result: boolean | App.Service.Response | null,
        sucMessage?: string,
        errMessage?: string
      ) => {
        if (
          result == true ||
          (result &&
            typeof result == "object" &&
            (result as App.Service.Response).code == 200 &&
            (result as App.Service.Response).type == "success")
        )
          useMsg.success(sucMessage ?? "操作成功");
        else useMsg.error(errMessage ?? "操作失败");
      };
    }

    register();

    return () => createTextVNode();
  },
});
</script>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <ContextHolder />
          <slot></slot>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<style scoped></style>
