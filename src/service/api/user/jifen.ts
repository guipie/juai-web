import { request } from "@/service/request";
/**签到 */
export function qianDao() {
  return request<boolean>({
    url: "/app/api/user/QianDaoToday",
    method: 'post'
  });
}
