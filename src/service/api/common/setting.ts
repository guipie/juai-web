import { request } from "@/service/request";

export function upgrade() {
  return request<any>({ url: `/app/api/Upgrade/Version`, method: 'get' });
}
