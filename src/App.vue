<script setup lang="ts">
import { computed, onMounted } from "vue";
import { NConfigProvider, darkTheme } from "naive-ui";
import { useAppStore } from "./store/modules/app";
import { useThemeStore } from "./store/modules/theme";
import { naiveDateLocales, naiveLocales } from "./locales/naive";
// import pkg from "~/package.json";
// import { upgrade } from "./service/api/common/setting";
// import { useAuthStore } from "@/store/modules/auth";
import { useAICommonStore } from "@/store/modules/aicommon";
// const { name, version } = pkg;
defineOptions({
  name: "App",
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined));

const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale];
});

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale];
});
onMounted(() => {
  useAICommonStore().getAllModels();
  // upgrade()
  //   .then((res) => {
  //     if (res.data.version != version) {
  //       window.$dialog?.create({
  //         title: `${name}版本【${version}】`,
  //         content: `发现新版本[${res.data.version}]，正在自动更新中...`,
  //         closable: false,
  //         positiveText: "确定更新",
  //         negativeText: res.data.isForceUpdate ? "" : "暂不更新",
  //         onPositiveClick: () => {
  //           useAuthStore().resetStore();
  //           window.location.reload();
  //         },
  //         onClose: () => {
  //           window.location.reload();
  //         },
  //       });
  //     }
  //   })
  //   .catch((err) => {
  //     window.$dialog?.warning({ content: "系统升级中，请稍后重试" });
  //   });
});
</script>

<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <AppProvider>
      <RouterView class="bg-layout" />
    </AppProvider>
  </NConfigProvider>
</template>

<style></style>
