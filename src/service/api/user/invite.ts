import { request } from "@/service/request";
/**自定义支付 */
export function payBefore(payInfo: string) {
  return request<boolean>({
    url: "/app/api/userPay/pay/before",
    method: 'post',
    data: { data: payInfo },
    headers: { Accept: 'application/json, text/plain, */*' }
  });
}
/**获取并设置邀请码 */
export function getInviteCode() {
  return request<string>({
    url: "/app/api/user/InviteCode",
    method: 'get',
  });
}

/**获取我邀请的人 */
export function getInviteUsers(page: number, size: number) {
  return request<JuApp.Paging>({
    url: `/app/api/user/InviteUsers/${page}/${size}`,
    method: 'get',
  });
}
