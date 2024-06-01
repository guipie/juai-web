<template>
  <n-space vertical>
    <n-el>
      <n-progress
        type="multiple-circle"
        :stroke-width="6"
        :circle-gap="0.5"
        :percentage="[
          percentage,
          (percentage + 10) % 100,
          (percentage + 20) % 100,
          (percentage + 30) % 100,
        ]"
        :color="[
          'var(--info-color)',
          'var(--success-color)',
          'var(--warning-color)',
          'var(--error-color)',
        ]"
        :rail-style="[
          { stroke: 'var(--info-color)', opacity: 0.3 },
          { stroke: 'var(--success-color)', opacity: 0.3 },
          { stroke: 'var(--warning-color)', opacity: 0.3 },
          { stroke: 'var(--error-color)', opacity: 0.3 },
        ]"
      >
        <div style="text-align: center">正在绘图中.</div>
      </n-progress>
    </n-el>
  </n-space>
</template>

<script lang="ts" setup>
import { NSpace, NEl, NProgress } from "naive-ui";
// const percentageRef = ref(0);
interface Props {
  percentage: number;
}
defineProps<Props>();
// const add = () => {
//   percentageRef.value += 10;
//   if (percentageRef.value > 100) {
//     percentageRef.value = 0;
//   }
// };
// const minus = () => {
//   percentageRef.value -= 10;
//   if (percentageRef.value < 0) {
//     percentageRef.value = 100;
//   }
// };
</script>
