<template>
  <div>
    <n-space vertical>
      <n-input
        type="text"
        size="small"
        v-model:value="txt"
        placeholder="关键字"
        @input="handleInput"
      />
      <div v-if="txt">
        <juImage v-if="props.drawingType == 'artistic_text'" :src="base64"></juImage>
        <!-- <NQrCode
          v-else-if="props.drawingType == 'qr_code'"
          :value="txt"
          id="drawingQrcode"
          :size="300"
        ></NQrCode> -->
        <qrcode-vue
          v-else-if="props.drawingType == 'qr_code'"
          id="drawingQrcode"
          :value="txt"
          :size="400"
          level="H"
        />
      </div>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import juImage from "@/components/custom/juImage.vue";
import { ElToImgBase64, StrToImgBase64 } from "@/utils/base64";
import QrcodeVue from "qrcode.vue";
interface Props {
  drawingType: string;
  prompt_ex: string;
}
const props = defineProps<Props>();
const txt = ref(props.prompt_ex);
const base64 = ref<string>(StrToImgBase64(txt.value));
onMounted(() => {
  handleInput();
});
const handleInput = () => {
  if (props.drawingType == "artistic_text") {
    base64.value = StrToImgBase64(txt.value);
  } else if (props.drawingType == "qr_code") {
    setTimeout(() => {
      nextTick(() => {
        ElToImgBase64("drawingQrcode").then((res) => {
          base64.value = res;
        });
      });
    }, 500);
  }
};
defineExpose({
  base64,
});
</script>

<style scoped></style>
