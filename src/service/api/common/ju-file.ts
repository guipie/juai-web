import { request } from "@/service/request";
import { JuFile } from "@/typings/common/ju-file";

export function uploadFile(file: File, path?: string) {
  let formdata = new FormData();
  formdata.append("file", file);
  return request<JuFile>({
    url: `app/api/juFile/uploadFile?path=${path}`,
    data: formdata,
    method: 'post',
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function delFile(fileOptions: { url?: string, fileId?: string }) {
  return request<boolean>({ url: `/app/api/userLogin/vcode`, method: 'post' });
}
