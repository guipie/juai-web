<template>
  <!-- 公共文件上传组件，包含图片、文件等 -->
  <div class="uploadPage">
    <n-upload
      v-model:file-list="fileList"
      :default-upload="false"
      :accept="uploadType"
      :list-type="listType"
      :max="maxNum"
      show-download-button
      show-preview-button
      @change="changeFile"
    >
      上传文件
    </n-upload>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, PropType } from "vue";
import { uploadFile } from "@/service/api/common/ju-file";
import { UploadFileInfo } from "naive-ui";
import { JuFile } from "@/typings/common/ju-file";
const defaultImgTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];
interface SetupContext {
  //这里还有其他的，为了避免混淆，就不写了。
  emit: (event: string, ...args: unknown[]) => void;
}
export default {
  name: "uploadPage",
  props: {
    path: String, //保存的文件路径
    valUrl: String,
    valModel: Object as PropType<JuFile>,
    listType: {
      default: () => "image-card",
      type: String as PropType<"text" | "image" | "image-card">,
    },
    maxNum: {
      default: () => 1,
      type: Number,
    },
    uploadType: {
      type: String,
      default: () => defaultImgTypes.toString(),
    }, //文件形式  .doc,.docx,.pdf,.xls,.xlsx,.zip,.rar,.jpg,.png,.jpeg,.svg,.gif
  },
  setup(props, { emit }: SetupContext) {
    const allData: { fileList: UploadFileInfo[] } = reactive({
      fileList: [],
      maxNum: props.maxNum,
    });
    // 文件上传和删除
    const changeFile = async (options: {
      file: UploadFileInfo;
      fileList: Array<UploadFileInfo>;
      event?: Event;
    }) => {
      console.log(options, "文件上传");
      if (options.event) {
        let res = await uploadFile(options.file.file!, props.path);
        if (res.data?.url) {
          options.file.url = res.data.url;
          options.file.status = "finished";
          emit("update:valModel", res.data);
          emit("update:valUrl", res.data.url);
        } else options.file.status = "error";
      } else {
        // 文件删除,根据文件名进行匹配
        console.log("文件删除??");
        emit("update:valModel", null);
        emit("update:valUrl", "");
      }
    };
    // watchEffect(() => {
    //   console.log("props.valUrl,props.valUrl", props.valUrl, props.valModel);

    //   if (props.valUrl) {
    //     allData.fileList.push({
    //       id: getFileName(props.valUrl),
    //       name: getFileName(props.valUrl),
    //       url: props.valUrl,
    //       status: "finished",
    //     });
    //   } else if (props.valModel) {
    //     allData.fileList.push({
    //       id: props.valModel.id.toString(),
    //       name: props.valModel.fileName,
    //       url: props.valModel.url,
    //       status: "finished",
    //     });
    //   }
    // });
    onMounted(() => {
      // 修改时图片回显
      allData.fileList = [];
      console.log(props.valUrl);
    });
    onBeforeMount(() => {
      allData.fileList = [];
    });
    return {
      ...toRefs(allData),
      changeFile,
    };
  },
};
</script>
<style lang="less">
.uploadPage {
  width: 100%;
}
</style>
