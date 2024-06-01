<template>
  <div
    class="mx-auto mt-16 max-w-4xl rounded-3xl ring-1 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none  dark:text-white"
  >
    <div class="p-8 sm:p-10 lg:flex-auto">
      <h3 class="text-2xl font-bold tracking-tight">旗舰版</h3>
      <p class="mt-6 text-base leading-7  dark:text-white:88">
        考虑到一些重度用户，想要私有化部署，企业内部使用等；可定制旗舰版，帮您部署到你的服务器。
      </p>
      <div class="mt-10 flex items-center gap-x-4">
        <h4 class="flex-none text-sm font-semibold leading-6">旗舰版支持</h4>
        <div class="h-px flex-auto bg-gray-100" />
      </div>
      <ul
        role="list"
        class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 sm:grid-cols-2 sm:gap-6"
      >
        <li
          v-for="feature in includedFeatures"
          :key="feature"
          class="flex gap-x-2 items-center"
        >
          <span class="h-6 w-5 flex-none"
            ><SvgIcon icon="clarity:success-line"></SvgIcon>
          </span>
          <NText type="success"><div v-html="feature"></div></NText>
        </li>
      </ul>
    </div>
    <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
      <div
        class="rounded-2xl py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
      >
        <div class="mx-auto max-w-xs px-8">
          <p class="text-base font-semibold"></p>
          <p class="mt-6 flex items-baseline justify-center gap-x-2">
            <span class="text-5xl font-bold tracking-tight"> {{ money }} </span>
            <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">
              人名币
            </span>
          </p>
          <div class="flex justify-between">
            <a
              href="#"
              class="mt-5 block rounded-md bg-indigo-600 px-3 py-2 text-center font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="handlePay('alipay')"
            >
              <div class="flex justify-center">
                <span style="font-size: x-large">
                  <SvgIcon icon="mingcute:alipay-fill"></SvgIcon>
                </span>
                <p>&nbsp;支付宝</p>
              </div>
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a
              href="#"
              class="mt-5 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click="handlePay('wxpay')"
            >
              <div class="flex justify-center">
                <span style="font-size: x-large">
                  <SvgIcon icon="mingcute:wechat-pay-fill"></SvgIcon>
                </span>
                <p>&nbsp;微&nbsp;&nbsp;&nbsp;&nbsp;信</p>
              </div>
            </a>
          </div>
          <p class="mt-6 text-xs leading-5 text-gray-600">遇到任何问题联系我们</p>
        </div>
        <form v-show="false" ref="payForm" method="post" :action="payUrl">
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { payBefore } from "@/service/api/user/invite";
import { useAuthStore } from "@/store/modules/auth";
import { encryptByUser, toMd5 } from "@/utils/cryptojs";
import { dateNow } from "@/utils/formatTime";
import { ref } from "vue";
const includedFeatures = ["私有化部署", "帮助注册各大AI账号", "简单定制化功能", "其他"];
const payForm = ref(null);
const payUrl = ref("");
const payScore = 10000000;
const money = 2999;
const handlePay = (payType: "alipay" | "wxpay") => {
  const timestamp = +new Date(); // 获取当前时间戳
  const randomNumber = Math.floor(Math.random() * 1000); // 生成一个 0 - 999 的随机数
  let outTradeNo = parseInt(String(timestamp) + String(randomNumber)); // 将时间戳和随机数拼接并转化为整数
  var payInfo = {
    account: useAuthStore().userInfo.account,
    date: dateNow(),
    num: payScore,
    rmb: money,
    orderNo: outTradeNo,
  };
  let encryptPayInfo = encryptByUser(JSON.stringify(payInfo), "juai.link", "juai.link");
  const VITE_PAY_SUCCESS_NOTICE_URL = "http://juai.link/app/api/userPay/pay/success";
  let urlKey = [
    `money=${money}`,
    `name=聚AI会员`,
    `notify_url=${VITE_PAY_SUCCESS_NOTICE_URL}`,
    `out_trade_no=${outTradeNo}`,
    `param=${btoa(encryptPayInfo)}`,
    `pid=20230409133211`,
    `return_url=http://juai.link/my/score&type=${payType}`,
  ];
  const urlParmas = urlKey.sort().join("&");
  const md5 = toMd5(urlParmas + "MIJYt93fVLDic0mTJXT5HZYuGNdgdiAI");
  console.log(md5);
  payUrl.value = `https://7-pay.cn/submit.php?${urlParmas}&sign=${md5}`;
  console.log(payUrl);
  payBefore(encryptPayInfo)
    .then((res) => {
      console.log("初始化成功", res);
      if (res.data) {
        const form = (payForm.value as unknown) as HTMLFormElement;
        // form.target = "_blank"; 苹果微信不支持
        form.submit();
      } else window.$message?.warning("支付初始化失败,请联系管理员");
    })
    .catch((err: any) => {
      console.log("初始化失败", err);
      window.$message?.error("支付初始化失败,请联系管理员");
    });
};
</script>
