export const PublicClientMessage = "PublicClientMessage"; //接收客户端消息
export enum SocketMsgType {
  // 绘图任务完成后推送的消息。
  TaskDetail = 0,
}
export interface ClientMessage {
  messageType: SocketMsgType;
  data: any;
}
export function ReceiveSocketMsg(msg: ClientMessage) {
  console.log(msg);
}
