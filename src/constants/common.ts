import { transformRecordToOption } from '@/utils/common';

export const yesOrNoRecord: Record<CommonType.YesOrNo, App.I18n.I18nKey> = {
  Y: 'common.yesOrNo.yes',
  N: 'common.yesOrNo.no'
};

export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord);

export const drawingParameters: any = {
  width: {
    label: "宽度",
    value: 1024,
    type: "number",
    min: 512,
    max: 1024,
    step: 8
  },
  height: {
    label: "高度",
    value: 1024,
    type: "number",
    min: 512,
    max: 1024,
    step: 8
  },
  model: {
    label: "模型",
    value: 'dall-e-3',
    type: "radio",
    selectVal: [{
      label: 'DALL-E-3',
      value: 'dall-e-3'
    }, {
      label: 'DALL-E-2',
      value: 'dall-e-2'
    }],
    hiddenVal: true,
    desc: "DALL-E-3是openai最新模型，消耗积分较高。"
  },
  guidance_scale: {
    label: "指导等级",
    value: 7.5,
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    desc: "控制生成图像的多样性和质量之间的权衡。等级范围从 1 到 10；其中较高的指导比例值将使生成的图像更接近提供的提示，但可能会导致图像的多样性较低。相反，较低的指导比例值将导致更多样化的图像，但它们可能与提示不太匹配。"
  },
  high_noise_frac: {
    label: "高噪声分数",
    value: 0.75,
    type: "number",
    min: 0,
    max: 1,
    step: 0.1,
    desc: "“高噪声分数”一词指的是生成图像中的随机性或不可预测性水平。更高的噪声分数意味着生成的图像将包含更多的随机元素，使生成的图像辨识度降低，而更低的噪声分数将导致一个更接近输入文本的确定性图像；因此，选择适当的噪声分数取决于具体用例和生成图像中所需的抽象级别。"
  },
  seed: {
    label: "种子",
    value: 151886915,
    type: "number",
    desc: "种子参数允许您为图像生成过程设置特定的种子值，有助于生成一致且可重现的图像。当您希望在图像生成中获得可重现的结果时，这将非常有用。",
    max: 2147483647,
    min: 0,
    step: 1,
  },
  steps: {
    label: "训练步骤",
    value: 35,
    type: "number",
    min: 1,
    max: 100,
    step: 1,
    desc: "  此参数为步骤参数，在聚AI中用于指定要执行的训练迭代次数；是模型优化功能中的一个重要参数，它控制着优化过程中的迭代或更新次数,值越大更新迭代越久,训练时间越长。"
  },
  cfg_scale: {
    label: "CFG比例",
    value: 7,
    type: "number",
    min: 1,
    max: 10,
    step: 1,
    desc: "该参数用于控制生成文本的大小，值越大，生成的文本就越大，而 值越小，生成的文本就越小。"
  },
  control_image_ratio: {
    label: "图形比例控制",
    value: 0.75,
    type: "number",
    min: 0,
    max: 1,
    step: 0.05,
    desc: "输入比例参数是用于控制控制图像与输入图像的比例。当您想确保控制图像和输入图像的大小相同时，这个参数就特别有用，这对某些机器学习任务非常重要。"
  },
  control_weight: {
    label: "重量控制",
    value: 0.9,
    type: "number",
    min: 0,
    max: 3,
    step: 0.05,
    desc: "此参数用于控制应用于输入文本的艺术变形程度。值越大，文本的扭曲程度就越大，而值越小，生成的文本就越接近原始输入文本。"
  },
  guidance_start: {
    label: "起始点",
    value: 0.3,
    type: "number",
    min: 0,
    max: 0.5,
    step: 0.05,
    desc: "该参数决定了模型根据给定提示开始生成艺术文本的起始点。例如，如果您设置 【起始点=0.3】，那么模型生成的文本将受提示的影响最多 30%，然后将开始生成更具艺术性和创造性的文本。"
  },
  guidance_end: {
    label: "终点",
    value: 0.95,
    type: "number",
    min: 0,
    max: 1,
    step: 0.05,
    desc: "该参数用于指定生成的文本在接近序列末尾时允许的随机程度。较低的值（例如接近 0）意味着模型将更贴近提示，生成更确定的文本，而较高的值；（例如接近 1）意味着模型将引入更多随机性，偏离提示。在 当前默认值【终点=0.9】的情况下，这意味着模型在生成文本时将允许一定程度的随机性，但仍会尽量紧跟给定的提示。"
  },
}
