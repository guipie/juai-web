import { computed } from 'vue';
import { useCountDown, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { REG_EMAIL, REG_PHONE } from '@/constants/reg';
import { fetchEmailCode, fetchPhoneCode } from '@/service/api';

export function useCaptcha() {
  const { loading, startLoading, endLoading } = useLoading();
  const { count, start, stop, isCounting } = useCountDown(60);

  const label = computed(() => {
    let text = $t('page.login.codeLogin.getCode');

    const countingLabel = $t('page.login.codeLogin.reGetCode', { time: count.value });

    if (loading.value) {
      text = '';
    }

    if (isCounting.value) {
      text = countingLabel;
    }

    return text;
  });

  function isAccountValid(phone: string) {

    if (phone.trim() === '') {
      window.$message?.error?.($t('form.userName.required'));
      return false;
    }
    if (!REG_PHONE.test(phone) && !REG_EMAIL.test(phone)) {
      window.$message?.error?.($t('form.userName.invalid'));
      return false;
    }

    return true;
  }
  async function getCaptcha(phoneEmail: string) {
    const valid = isAccountValid(phoneEmail);

    if (!valid || loading.value) {
      return;
    }

    startLoading();
    if (REG_PHONE.test(phoneEmail))
      await fetchPhoneCode(phoneEmail).then(res => res.data && window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess')))
    else if (REG_EMAIL.test(phoneEmail))
      await fetchEmailCode(phoneEmail).then(res => res.data && window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess')))
    start();
    endLoading();
    await new Promise(resolve => setTimeout(resolve, 1000 * 60));
  }

  return {
    label,
    start,
    stop,
    isCounting,
    loading,
    getCaptcha
  };
}
