import { useAuthStore } from "@/store/modules/auth";

export function isMy(userId: bigint) {
  return userId === useAuthStore().userInfo.userId;
}
