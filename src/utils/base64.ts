import html2canvas from "html2canvas";

export const base64Prex = "data:image/png;base64,";
export function StrToImgBase64(str: string, isReplace?: boolean) {
  // 创建一个新的Canvas元素
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d')!;
  // 设置Canvas的宽度和高度
  canvas.width = 400;
  canvas.height = 300;

  // // 设置你想要的字体、填充颜色等样式
  // context.font = '18px Arial';
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);
  var maxWidth = canvas.width; // 字体最大宽度为 Canvas 宽度
  var fontSize = 200; // 初始字体大小
  var textWidth;

  context.textAlign = 'center'; // 设置文本对齐方式
  context.textBaseline = 'middle'; // 设置文本基线
  context.fillStyle = 'white'; // 设置文本颜色为白色

  do {
    // 每次循环前设置字体大小
    context.font = fontSize + "px Arial";
    // 测量文本宽度
    textWidth = context.measureText(str).width;
    // 如果文本宽度大于最大宽度，则减小字体大小
    if (textWidth > maxWidth) {
      fontSize -= 1;
    }
  } while (textWidth > maxWidth && fontSize > 0); // 如果文本宽度超出范围并且字体大小不为0，则继续循环

  // 将字符串绘制到Canvas上
  context.fillText(str, canvas.width / 2, canvas.height / 1.8);
  // 从Canvas中导出图像数据为base64编码的PNG格式
  var base64Image = canvas.toDataURL('image/png');

  // 输出base64编码的图像字符串
  if (isReplace) return base64Image.replace(
    base64Prex,
    ""
  );
  return base64Image;
}

export function ElToImgBase64(elementId: string, isReplace?: boolean) {
  let ele = document.querySelector("#" + elementId)?.querySelector("canvas");
  if (!ele)
    ele = document.getElementById(elementId) as HTMLCanvasElement;
  if (ele)
    return html2canvas(ele as HTMLCanvasElement, {
      useCORS: true,
      allowTaint: true,
    }).then(canvas => {
      const imgUrl = canvas.toDataURL("image/png");
      if (imgUrl.length < 20) throw new Error("base64图片生成失败");
      if (isReplace) return imgUrl.replace(
        base64Prex,
        ""
      );
      return imgUrl;
    });
  else
    throw new Error("未获取到canvas");

}
