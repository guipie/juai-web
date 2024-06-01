<script setup lang="ts">
import { $t } from "@/locales";

defineOptions({
  name: "GlobalLogo",
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true,
});
</script>

<template>
  <JuLink
    to="https://juai.link/"
    target="_blank"
    class="w-full flex-center nowrap-hidden"
  >
    <!-- <SystemLogo /> -->
    <h2 class="text-24px text-primary font-800 transition duration-300 ease-in-out">
      {{ $t("system.name") }}
    </h2>
  </JuLink>
</template>

<style scoped></style>
