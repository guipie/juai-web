import { useAuthStore } from '@/store/modules/auth'
import CryptoJS from 'crypto-js'
const key = CryptoJS.enc.Utf8.parse('123456789asdfghj') // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('asdfghj123456789') // 十六位十六进制数作为密钥偏移量
/* 加密 */
export function encrypt(word: any) {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.ciphertext.toString().toUpperCase()
}

/* 解密 */
export function decrypt(word: any) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
/* 加密-.net-根据用户信息 */
export function encryptByUser(word: any, key?: string, iv?: string): string {
  const userStore = useAuthStore()
  if (!userStore.isLogin || !userStore.userInfo?.account) throw new Error('未登录用户，无法使用')
  const ukey = CryptoJS.enc.Utf8.parse((key ?? userStore.userInfo.account).padEnd(16, '1'))
  const uiv = CryptoJS.enc.Latin1.parse((iv ?? userStore.userInfo.account).padEnd(16, '1'))
  return CryptoJS.AES.encrypt(word, ukey, {
    iv: uiv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

/* 解密-.net-根据用户信息 */
export function decryptByUser(word: any, key?: string, iv?: string) {
  const userStore = useAuthStore()
  if (!userStore.isLogin || !userStore.userInfo?.account) throw new Error('未登录用户，无法使用')
  const ukey = CryptoJS.enc.Utf8.parse((iv ?? userStore.userInfo.account).padEnd(16, '1'))
  const uiv = CryptoJS.enc.Latin1.parse((iv ?? userStore.userInfo.account).padEnd(16, '1'))
  return CryptoJS.AES.decrypt(word, ukey, {
    iv: uiv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}

export function toMd5(data: string) {
  return CryptoJS.MD5(data).toString().toLowerCase()
}
