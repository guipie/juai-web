import { request } from "@/service/request";
import { Drawing } from "@/typings/ai/drawing";
import { AxiosProgressEvent } from "axios";
export function getConfigurations() {
  return request<Drawing.Configuration[]>({
    url: "/app/api/drawingImage/DrawingConfigurations",
    method: 'get'
  });
}
export function delMyDrawing(draingId: bigint) {
  return request<boolean>({
    url: "/app/api/drawingImage/myDrawing/" + draingId,
    method: 'delete'
  });
}
export function fetchDrawingImage(imageReq: any, onDownloadProgress: (progressEvent: AxiosProgressEvent) => void) {
  var url = '/app/api/DrawingLepton/Drawing';
  if (imageReq.drawingType == 'openai')
    url = "/app/api/DrawingOpenai/Drawing";
  return request<any>({
    url: url,
    data: imageReq,
    method: 'post',
    onDownloadProgress: onDownloadProgress,
    timeout: 1000 * 60 * 5
  })
}

export function fetchDrawedImage(imageReq: any, url: string) {
  return request<Drawing.DrawingResponse>({
    url: url,
    data: imageReq,
    method: 'post',
    timeout: 1000 * 60 * 5
  })
}
export function fetchDrawingRecommend(drawingType: Drawing.DrawingType) {
  var url = '/app/api/DrawingImage/Recommend/' + drawingType;
  return request<Drawing.DrawingResponse[]>({
    url: url,
    method: 'get'
  })
}
//执行中的，执行失败的等
export function fetchMyAbnormalDrawing(drawingType?: Drawing.DrawingType, minId?: number) {
  var url = `/app/api/DrawingImage/MyAbnormalDrawing?drawingType=${drawingType ?? ""}&minId=${minId ?? ''}`;
  return request<Drawing.DrawingResponse[]>({
    url: url,
    method: 'get'
  })
}
export function fetchMyDrawing(drawingType?: Drawing.DrawingType, minId?: number) {
  var url = `/app/api/DrawingImage/MyALl?drawingType=${drawingType ?? ""}&minId=${minId ?? ''}`;
  return request<Drawing.DrawingResponse[]>({
    url: url,
    method: 'get'
  })
}
