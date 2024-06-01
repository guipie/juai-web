import * as SignalR from '@microsoft/signalr';
import { localStg } from '@/utils/storage';
import { createServiceConfig } from '../service';

const { baseURL } = createServiceConfig(import.meta.env);
// 初始化SignalR对象
const connection = new SignalR.HubConnectionBuilder()
  .configureLogging(SignalR.LogLevel.Information)
  .withUrl(`${baseURL}hubs/onlineUser?access_token=${localStg.get('token')}`, { transport: SignalR.HttpTransportType.WebSockets, skipNegotiation: true })
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: () => {
      return 5000; // 每5秒重连一次
    },
  })
  .build();

connection.keepAliveIntervalInMilliseconds = 15 * 1000; // 心跳检测15s
connection.serverTimeoutInMilliseconds = 30 * 60 * 1000; // 超时时间30m

// 启动连接
connection.start().then(() => {
  console.log('启动连接');
});
// 断开连接
connection.onclose(async () => {
  console.log('断开连接');
});
// 重连中
connection.onreconnecting(() => {
  window.$notification?.create({
    title: '提示',
    content: '服务器已断线...',
    type: 'error'
  })
});
// 重连成功
connection.onreconnected(() => {
  console.log('重连成功');
  window.$notification?.destroyAll();
});

// // 在线用户列表
// connection.off('OnlineUserList');
// connection.on('OnlineUserList', (data: any) => {
//   state.onlineUserList = data.userList;
//   state.lastUserState = {
//     online: data.online,
//     realName: data.realName,
//   };
//   notificationThrottle();
// });

// connection.on('OnlineUserList', (res) => {
//   console.log(res);
// });
export { connection as mySignalR };
