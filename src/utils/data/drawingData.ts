import { Drawing } from "@/typings/ai/drawing";
import { DrawingTypeEnum } from "@/typings/enums/drawing-enum";


export const drawingConfigs: Drawing.Configuration[] = [
  {
    "name": "DALL-E",
    "drawingType": DrawingTypeEnum.DALLE,
    "desc": "DALL-E 是当今市场上最强大的人工智能绘画工具，它是由 ChatGPT 背后的同一组织 OpenAI 开发的人工智能图像生成器，目前已经升级到DALL-E三代。它利用一种被称为 “生成式人工智能” 的技术，根据文本提示从零开始创建原始图像。",
    "tags": "OpenAI,DALL-E,ChatGPT,文生图",
    "request": {
      prompt: "",
      n: 1,
      model: "dall-e-3",
      size: "1024x1024",
      style: "vivid",
      quality: "standard",
    },
    "api": "/app/api/drawingOpenAI/drawing",
    "example": {
      "prompt": "荔枝纹风格的球形椅子，具有凹凸不平的白色外观和豪华的内部，衬托着热带壁纸。",
      "url": "http://oss.juai.link/juai/drawing/openai.jpeg"
    }
  },
  {
    "name": "Stable Diffusion XL",
    "drawingType": DrawingTypeEnum.ALIWANX,
    "desc": "SD有名的开源模型,由Stability AI 正式推出,图像可免费商用，扩散模型能够在给定任何文本输入的情况下生成照片般逼真的图像。",
    "tags": "SDXL,文生图",
    "request":
    {
      "model": "wanx-v1",
      "input": {
        "prompt": "",
        "ref_img": ""
      },
      "parameters": {
        "style": "<auto>",
        "size": "1024*1024",
        "n": 1,
        "seed": 42,
        "ref_strength": 0.5,
        "ref_mode": "repaint"
      }
    },
    "api": "/app/api/DrawingAlibaba/DrawingText2Image",
    "example": {
      "prompt": "柔和的粉红色玫瑰、白色中国牡丹、小苹果花、桉树叶、蔓越莓树枝、铜胡椒浆果树枝全部排列在粉红色镍杯上，形成可爱美丽的插花。杯子放在一本厚厚的白书上，封面是金色的。阳光明媚、明亮的形象。广告文案，图像顶部巨大的文案空间，负空间，高清，8k，模糊梦幻背景，美丽的图片。产品",
      "url": "http://oss.juai.link/juai/drawing/wanx-v1.webp"
    }
  }
]
