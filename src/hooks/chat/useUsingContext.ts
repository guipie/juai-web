import { computed } from 'vue'
import { $t as t } from '@/locales'
import { useChatStore } from '@/store/modules/chat'
import { useAuthStore } from '@/store/modules/auth';

export function useUsingContext() {
  const chatStore = useChatStore()
  const userAuth = useAuthStore();
  const usingContext = computed<boolean>(() => chatStore.usingContext)
  const usingShareContext = computed<boolean>(() => chatStore.usingShareContext ?? false)
  const usingAsyncDb = computed<boolean>(() => chatStore.usingAsyncDb)

  const toggleShareUsingContext = () => {
    if (!usingShareContext.value && !userAuth.isLogin) {
      window.$dialog?.info({
        title: "登录提示",
        content:
          "您未登录，无法启用上下文，请先登录；启用后会携带之前的聊天记录，回答更智能。",
        positiveText: "去登录",
        negativeText: "取消",
        onPositiveClick: () => {
          window.location.href = "/login";
        },
      });
    } else chatStore.usingShareContext = !(chatStore.usingShareContext ?? false);
  };
  function toggleUsingContext() {
    chatStore.setUsingContext(!usingContext.value)
    if (usingContext.value)
      window.$message?.success(t('chat.turnOnContext'))
    else
      window.$message?.warning(t('chat.turnOffContext'))
  }
  function toggleUsingAsyncDb() {
    chatStore.setUsingAsyncDb(!usingAsyncDb.value)
    if (usingAsyncDb.value)
      window.$message?.success(t('chat.turnOnAsyncDb'))
    else
      window.$message?.warning(t('chat.turnOffAsyncDb'))
  }
  return {
    usingContext,
    usingShareContext,
    usingAsyncDb,
    toggleShareUsingContext,
    toggleUsingContext,
    toggleUsingAsyncDb,
  }
}
