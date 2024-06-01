<template>
  <div class="container h-full py-8 sm:py-2">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <!-- <div class="mx-auto max-w-2xl sm:text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Title
        </h2>
        <p class="mt-6 text-lg leading-8">
          Descrption
        </p>
      </div> -->
      <customVue></customVue>
      <memberVue></memberVue>
    </div>
  </div>
</template>
<script setup lang="ts">
import customVue from "@/components/invite/custom.vue";
import memberVue from "@/components/invite/member.vue";
</script>

<style lang="scss" scoped></style>
