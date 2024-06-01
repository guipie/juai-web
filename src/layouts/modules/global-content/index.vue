<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { useThemeStore } from "@/store/modules/theme";
import { useRouteStore } from "@/store/modules/route";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { computed } from "vue";

defineOptions({
  name: "GlobalContent",
});

interface Props {
  /** Show padding for content */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: !useBasicLayout().isMobile.value,
});

const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();

const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''));
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <KeepAlive :include="routeStore.cacheRoutes" v-if="appStore.reloadFlag">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="route.path"
          :class="{ 'p-12px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
