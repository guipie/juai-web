<template>
  <n-select
    style="width: 100%"
    v-model:value="defaultVal"
    :disabled="disabled"
    :on-update:value="(val) => $emit('update:val', val)"
    :options="
      aiStore.models?.map((m) => {
        return { value: m.name, label: m.shortName };
      })
    "
  />
</template>

<script setup lang="ts">
import { useAICommonStore } from "@/store/modules/aicommon";
import { useChatStore } from "@/store/modules/chat";
import { onMounted, ref, watch } from "vue";
const aiStore = useAICommonStore();
const props = defineProps({
  val: String,
  disabled: Boolean,
});
const defaultVal = ref(props.val ?? "");
console.log(defaultVal.value);
watch(
  () => props.val,
  () => {
    console.log("defaultVal.value", props.val);
    defaultVal.value = props.val ?? useChatStore().deafultModel;
    emits("update:val", defaultVal.value);
  }
);
const emits = defineEmits(["update:val"]);
onMounted(async () => {
  await aiStore.getAllModels();
});
</script>

<style scoped></style>
