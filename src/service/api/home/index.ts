import { request } from '../../request';
/** 我的主页统计 */
export function getMyStatistics() {
  return request<any>({
    url: "/app/api/juai/MyStatistics",
    method: 'get'
  });
}

export function getSysNoticeCount() {
  return request<number>({
    url: "/app/api/juai/SysNoticeCount",
    method: 'get'
  });
}
export function getNotices(page?: number) {
  return request<any>({
    url: "/app/api/juai/SysNotices?page=" + page,
    method: 'get'
  });
}
