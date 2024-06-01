<script lang="ts" setup>
import juavatar from "@/components/custom/juavatar.vue";
import { useRouterPush } from "@/hooks/common/router";
import { useDrawingStore } from "@/store/modules/drawing";
import { Drawing } from "@/typings/ai/drawing";
import { onMounted } from "vue";
const { routerPushByKey } = useRouterPush();
const drawingStore = useDrawingStore();
onMounted(() => {
  drawingStore.drawingInit();
});
// <juavatar :src="textImageHome"></juavatar>
const toTool = (item: Drawing.Configuration) => {
  // router.push("/drawing/tool/" + item.name);
  routerPushByKey("drawing_tool", { params: { name: item.drawingType } });
};
</script>
<template>
  <div class="relative mt-6 w-full overflow-x-auto">
    <ul
      role="list"
      class="resources grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    >
      <div
        class="group relative flex cursor-pointer overflow-hidden rounded ring-1 ring-inset ring-zinc-200 group-hover:ring-zinc-900/10 dark:ring-white/5 dark:group-hover:ring-white/10 bg-white transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/5 dark:hover:shadow-black/5"
        v-for="item in drawingStore.configurations"
        @click="toTool(item)"
      >
        <div class="pointer-events-none">
          <div
            class="absolute inset-0 transition duration-300 [mask-image:linear-gradient(transparent,white)] group-hover:opacity-30"
          >
            <svg
              aria-hidden="true"
              class="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 opacity-70 dark:fill-white/10 dark:stroke-white/5 dark:opacity-30"
            >
              <defs>
                <pattern
                  id=":r79:"
                  width="72"
                  height="56"
                  patternUnits="userSpaceOnUse"
                  x="50%"
                  y="21"
                >
                  <path d="M.5 56V.5H72" fill="none"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" stroke-width="0" fill="url(#:r79:)"></rect>
              <svg x="50%" y="21" class="overflow-visible">
                <rect stroke-width="0" width="73" height="57" x="0" y="56"></rect>
                <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
              </svg>
            </svg>
          </div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-[#2F80ED] to-[#2D9CDB] opacity-0 transition duration-300 group-hover:opacity-10"
            style="mask-image: radial-gradient(180px at 296px 17px, white, transparent)"
          ></div>
          <div
            class="absolute inset-0 opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
            style="mask-image: radial-gradient(180px at 296px 17px, white, transparent)"
          >
            <svg
              aria-hidden="true"
              class="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 opacity-30 dark:fill-white/5 dark:stroke-white/10"
            >
              <defs>
                <pattern
                  id=":r7a:"
                  width="72"
                  height="56"
                  patternUnits="userSpaceOnUse"
                  x="50%"
                  y="21"
                >
                  <path d="M.5 56V.5H72" fill="none"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" stroke-width="0" fill="url(#:r7a:)"></rect>
              <svg x="50%" y="21" class="overflow-visible">
                <rect stroke-width="0" width="73" height="57" x="0" y="56"></rect>
                <rect stroke-width="0" width="73" height="57" x="72" y="168"></rect>
              </svg>
            </svg>
          </div>
        </div>
        <div class="relative p-4">
          <div
            class="mt-2 flex items-center gap-3 text-lg font-semibold leading-7 text-zinc-900 dark:text-white"
          >
            <juavatar :src="item.example.url"></juavatar>
            {{ item.name }}
          </div>
          <p class="mt-2 line-clamp-3 pl-0.5 text-sm text-zinc-600 dark:text-zinc-400">
            {{ item.desc }}
          </p>
          <div class="mt-4 flex gap-2">
            <span
              class="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              v-for="tag in item.tags?.split(',')"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>
