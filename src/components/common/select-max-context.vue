<template>
  <n-select
    v-model:value="defaultVal"
    :disabled="disabled"
    :options="showCreteMaxContexts"
    :render-label="renderMaxContextLabel"
    :render-tag="renderSelectMaxContext"
    :on-update:value="(val) => $emit('update:val', val)"
  />
</template>

<script setup lang="ts">
import { NText, SelectRenderLabel, SelectRenderTag } from "naive-ui";
import { h, ref, watch } from "vue";
const props = defineProps({
  val: Number,
  disabled: Boolean,
});
const defaultVal = ref(props.val ?? 3);
const emits = defineEmits(["update:val"]);
watch(
  () => props.val,
  () => {
    console.log("defaultVal.value", props.val);
    defaultVal.value = props.val ?? 3;
    emits("update:val", defaultVal.value);
  }
);
const showCreteMaxContexts = [
  {
    label: "无记忆",
    value: 0,
    desc: "每次对话都是独立的，常用于一次性问答，节省积分",
  },
  {
    label: "基础",
    value: 3,
    desc: "记住最近的三次对话",
  },
  {
    label: "中等",
    value: 6,
    desc: "记住最近的六次对话",
  },
  {
    label: "高级",
    value: 1000,
    desc: "记住当前会话的所有对话，慎用，消耗积分较多",
  },
];

const renderMaxContextLabel: SelectRenderLabel = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0",
          },
        },
        [
          h("div", null, [option.label as string]),
          h(
            NText,
            { depth: 3, tag: "div", class: "text-wrap" },
            {
              default: () => option.desc as string,
            }
          ),
        ]
      ),
    ]
  );
};
const renderSelectMaxContext: SelectRenderTag = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.label as string]
  );
};
</script>

<style scoped></style>
