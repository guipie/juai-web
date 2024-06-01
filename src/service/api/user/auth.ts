import { request } from '../../request';
import { sm2 } from 'sm-crypto-v2';
/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, options: { password?: string, code?: string }) {
  if (options.password) {
    const publicKey = `04F6E0C3345AE42B51E06BF50B98834988D54EBC7460FE135A48171BC0629EAE205EEDE253A530608178A98F1E19BB737302813BA39ED3FA3C51639D7A20C7391A`;
    options.password = sm2.doEncrypt(options.password, publicKey, 1);
  }
  return request<Api.Auth.UserInfo>({
    url: '/app/api/userLogin/loginRegister',
    method: 'post',
    data: {
      account: userName,
      password: options.password,
      code: options.code
    }
  });
}
export function fetchPhoneCode(phone: string) {
  return request<boolean>({ url: `/app/api/userLogin/vcode/${phone}`, method: 'post' });
}
export function fetchEmailCode(email: string) {
  return request<boolean>({ url: `/app/api/userLogin/emailvcode/${email}`, method: 'post' });
}
/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(accessToken: string) {
  return request<string>({
    url: '/app/api/userLogin/refreshToken',
    method: 'post',
    data: accessToken,
    headers: {
      'content-type': 'application/json'
    }
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });
}


export function fetchDebug() {
  return request<string>({
    url: '/debug-post',
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      a: '1'
    }
  });
}
