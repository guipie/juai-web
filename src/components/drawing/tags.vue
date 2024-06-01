<template>
  <n-tabs type="line" value="风格" animated defaultValue="one">
    <n-tab-pane
      v-for="item in styles"
      :key="item.name"
      :name="item.name"
      :tab="item.name"
    >
      <div v-for="child in item.children" :key="child.name">
        <header class="text-lg font-bold m-2">#{{ child.name }}</header>
        <div class="flex flex-wrap gap-2">
          <div @click="onSelect(tag)" v-for="tag in child.tags">
            <n-tag
              style="cursor: pointer"
              checkable
              :checked="
                selectedStyles.findIndex((m:any) => m.name==tag.name) >
                -1
              "
              round
            >
              {{ tag.name }}
            </n-tag>
          </div>
        </div>
      </div>
    </n-tab-pane>
  </n-tabs>
</template>
<script lang="ts" setup>
import { PropType, ref } from "vue";
interface TagStyle {
  name: string;
  value: string;
}
const props = defineProps({
  selectedItems: {
    type: Array as PropType<TagStyle[]>,
    default: () => [],
  },
});
// const props = defineProps({});
interface Emit {
  (e: "onConfirm", selectedItems: TagStyle[]): void;
}
const emit = defineEmits<Emit>();
const onSelect = (tag: any) => {
  const index = selectedStyles.value.findIndex((m: any) => m.name == tag.name);
  if (index > -1) selectedStyles.value.splice(index, 1);
  else selectedStyles.value.push(tag);
};
const selectedStyles = ref(props.selectedItems);
const styles = [
  {
    name: "风格",
    children: [
      {
        name: "主题场景",
        tags: [
          {
            name: "Modernismo",
            value: "modernismo",
          },
          {
            name: "Rain",
            value: "rain",
          },
          {
            name: "Oni",
            value: "oni",
          },
          {
            name: "Emo",
            value: "emo",
          },
          {
            name: "Magical",
            value: "magical",
          },
          {
            name: "Retrofuturism",
            value: "retrofuturism",
          },
          {
            name: "Ethereal",
            value: "ethereal",
          },
          {
            name: "spring(春天)",
            value: "spring",
          },
          {
            name: "gothic(哥特式)",
            value: "gothic",
          },
        ],
      },
      {
        name: "绘画风格",
        tags: [
          {
            name: "3d(3D)",
            value: "3d",
          },
          {
            name: "abstract art(抽象艺术)",
            value: "abstract art",
          },
          {
            name: "abstract expressionism(抽象表现主义)",
            value: "abstract expressionism",
          },
          {
            name: "abstract illusion(抽象幻觉)",
            value: "abstract illusion",
          },
          {
            name: "analytical cubism(分析立体派)",
            value: "analytical cubism",
          },
          {
            name: "art deco(装饰艺术)",
            value: "art deco",
          },
          {
            name: "art nouveau(新艺术)",
            value: "art nouveau",
          },
          {
            name: "arte povera(贫穷艺术)",
            value: "arte povera",
          },
          {
            name: "automatismand(自动绘画)",
            value: "automatismand",
          },
          {
            name: "bayeux tapestry(贝叶绣)",
            value: "bayeux tapestry",
          },
          {
            name: "bohemian(波西米亚)",
            value: "bohemian",
          },
          {
            name: "brutalism(极简主义)",
            value: "brutalism",
          },
          {
            name: "byzantine（拜占庭）",
            value: "byzantine",
          },
          {
            name: "caricature(漫画讽刺)",
            value: "caricature",
          },
          {
            name: "cartographic art(地图艺术)",
            value: "cartographic art",
          },
          {
            name: "cartoon(卡通)",
            value: "cartoon",
          },
          {
            name: "cinematic(电影风格)",
            value: "cinematic",
          },
          {
            name: "color field painting(彩色领域绘画)",
            value: "color field painting",
          },
          {
            name: "colorful collages(色彩拼贴艺术)",
            value: "colorful collages",
          },
          {
            name: "comic(漫画)",
            value: "comic",
          },
          {
            name: "conceptual art(概念艺术)",
            value: "conceptual art",
          },
          {
            name: "concretism(具体派)",
            value: "concretism",
          },
          {
            name: "constructivism(构成主义)",
            value: "constructivism",
          },
          {
            name: "Contemporary",
            value: "contemporary",
          },
          {
            name: "coptic art(科普特艺术)",
            value: "coptic art",
          },
          {
            name: "cubism(立体派)",
            value: "cubism",
          },
          {
            name: "cubo futurism(立方未来主义)",
            value: "cubo futurism",
          },
          {
            name: "cyberdelic(赛博迪利克)",
            value: "cyberdelic",
          },
          {
            name: "dada(达达主义)",
            value: "dada",
          },
          {
            name: "dbz style(龙珠风格)",
            value: "dbz style",
          },
          {
            name: "digital art(数字艺术)",
            value: "digital art",
          },
          {
            name: "digital painting(数字绘画)",
            value: "digital painting",
          },
          {
            name: "disney(迪士尼)",
            value: "disney",
          },
          {
            name: "dynamic pose(动态姿势)",
            value: "dynamic pose",
          },
          {
            name: "Elizabethan(伊丽莎白)",
            value: "Elizabethan",
          },
          {
            name: "Empire/Regency（帝国线式轮廓/摄政时期）",
            value: "Empire/Regency",
          },
          {
            name: "fauvism(野兽派）",
            value: "fauvism",
          },
          {
            name: "figurative expressionism(形象表现主义)",
            value: "figurative expressionism",
          },
          {
            name: "flat design(扁平设计)",
            value: "flat design",
          },
          {
            name: "folk art(民间艺术)",
            value: "folk art",
          },
          {
            name: "funkypop(Funkypop风格)",
            value: "funkypop",
          },
          {
            name: "geometric(几何)",
            value: "geometric",
          },
          {
            name: "geometric painting(几何绘画)",
            value: "geometric painting",
          },
          {
            name: "ghibli(吉卜力)",
            value: "ghibli",
          },
          {
            name: "Gibson（吉布森）",
            value: "Gibson",
          },
          {
            name: "gothic(哥特式)",
            value: "gothic",
          },
          {
            name: "graffiti art(涂鸦艺术)",
            value: "graffiti art",
          },
          {
            name: "Highly detailed(高度详细)",
            value: "highly detailed",
          },
          {
            name: "hyperrealism(超现实写实)",
            value: "hyperrealism",
          },
          {
            name: "hyperrealistic anime(超写实动漫)",
            value: "hyperrealistic anime",
          },
          {
            name: "illustration(插画)",
            value: "illustration",
          },
          {
            name: "impressionism(印象派)",
            value: "impressionism",
          },
          {
            name: "isometric(等轴)",
            value: "isometric",
          },
          {
            name: "kawaii(可爱)",
            value: "kawaii",
          },
          {
            name: "kinetic art(运动艺术)",
            value: "kinetic art",
          },
          {
            name: "low poly(低多边形)",
            value: "low poly",
          },
          {
            name: "mail art(邮件艺术)",
            value: "mail art",
          },
          {
            name: "manga(漫画)",
            value: "manga",
          },
          {
            name: "manhua(漫画)",
            value: "manhua",
          },
          {
            name: "marvel(漫威)",
            value: "marvel",
          },
          {
            name: "memphis design(孟菲斯设计)",
            value: "memphis design",
          },
          {
            name: "Military(军旅风格)",
            value: "military",
          },
          {
            name: "minimalism(极简主义)",
            value: "minimalism",
          },
          {
            name: "Modern",
            value: "modern",
          },
          {
            name: "neo expressionism(新表现主义)",
            value: "neo expressionism",
          },
          {
            name: "neo geo(新地质派)",
            value: "neo geo",
          },
          {
            name: "neo impressionism(新印象派)",
            value: "neo impressionism",
          },
          {
            name: "neo minimalism(新极简主义)",
            value: "neo minimalism",
          },
          {
            name: "neo suprematism(新至上主义)",
            value: "neo suprematism",
          },
          {
            name: "neoplasticism(新构成主义)",
            value: "neoplasticism",
          },
          {
            name: "New Look(新风貌)",
            value: "New Look",
          },
          {
            name: "New Nordic(新北欧风格)",
            value: "New Nordic",
          },
          {
            name: "Nordic(北欧)",
            value: "Nordic",
          },
          {
            name: "octane render(Octane渲染)",
            value: "octane render",
          },
          {
            name: "op art(欧普/光影艺术)",
            value: "op art",
          },
          {
            name: "pattern and decoration(图案装饰)",
            value: "pattern and decoration",
          },
          {
            name: "photorealism(照片写实)",
            value: "photorealism",
          },
          {
            name: "pixar(皮克斯)",
            value: "pixar",
          },
          {
            name: "pop art(波普/流行艺术)",
            value: "pop art",
          },
          {
            name: "Portrait (肖像)",
            value: "portrait",
          },
          {
            name: "post impressionism(后印象派)",
            value: "post impressionism",
          },
          {
            name: "post minimalism(后极简主义)",
            value: "post minimalism",
          },
          {
            name: "postminimalism(后极简主义)",
            value: "postminimalism",
          },
          {
            name: "psychedelic(迷幻)",
            value: "psychedelic",
          },
          {
            name: "pysanky(乌克兰彩蛋艺术)",
            value: "pysanky",
          },
          {
            name: "realistic(现实主义)",
            value: "realistic",
          },
          {
            name: "Retro",
            value: "retro",
          },
          {
            name: "Rococo(洛可可",
            value: "rococo",
          },
          {
            name: "Sailor（水手）",
            value: "sailor",
          },
          {
            name: "spatialism(空间主义)",
            value: "spatialism",
          },
          {
            name: "Steampunk",
            value: "steampunk",
          },
          {
            name: "street photography(街头摄影)",
            value: "street photography",
          },
          {
            name: "sumi e(水墨画)",
            value: "sumi e",
          },
          {
            name: "surrealism(超现实主义)",
            value: "surrealism",
          },
          {
            name: "surrealism(超现实主义)",
            value: "surrealism",
          },
          {
            name: "symmetrical(对称)",
            value: "symmetrical",
          },
          {
            name: "synthetic cubism(合成立体派)",
            value: "synthetic cubism",
          },
          {
            name: "textile art(纺织艺术)",
            value: "textile art",
          },
          {
            name: "tropical(热带风格)",
            value: "tropical",
          },
          {
            name: "ukiyo-e(浮世绘)",
            value: "ukiyo-e",
          },
          {
            name: "unreal engine(虚幻引擎)",
            value: "unreal engine",
          },
          {
            name: "Victorian(维多利亚)",
            value: "Victorian",
          },
          {
            name: "whimsical(离奇幻想)",
            value: "whimsical",
          },
          {
            name: "workwear(工装)",
            value: "workwear",
          },
          {
            name: "zynga(zynga风格)",
            value: "zynga",
          },
        ],
      },
      {
        name: "艺术风格",
        tags: [
          {
            name: "日本动漫",
            value: "Japanese anime style",
          },
          {
            name: "中国水墨",
            value: "Chinese ink style",
          },
          {
            name: "电影海报",
            value: "Poster style",
          },
          {
            name: "哥特",
            value: "Gothic Architecture and Landscap",
          },
          {
            name: "仙女风格",
            value: "Fairy Kei fashion",
          },
          {
            name: "卡通",
            value: "cartoon style",
          },
          {
            name: "宫崎骏",
            value: "studio ghibli",
          },
          {
            name: "皮克斯",
            value: "pixar style",
          },
          {
            name: "皮影",
            value: "Chinese Shadow Puppets",
          },
          {
            name: "赛博朋克",
            value: "Cyberpunk",
          },
          {
            name: "刺绣",
            value: "Embroidery Art",
          },
          {
            name: "剪纸",
            value: "Paper cut craft",
          },
          {
            name: "浮世绘",
            value: "Ukiyoe",
          },
          {
            name: "橡皮泥",
            value: "Plasticine",
          },
          {
            name: "折纸",
            value: "Layered Paper",
          },
          {
            name: "乐高",
            value: "Out of LEGO",
          },
          {
            name: "涂鸦",
            value: "Graffiti art",
          },
          {
            name: "简笔画",
            value: "Stick figure",
          },
          {
            name: "潜意识",
            value: "Subconsciousness",
          },
          {
            name: "创世纪",
            value: "Enesis",
          },
          {
            name: "超现实主义",
            value: "Surrealism",
          },
          {
            name: "移轴摄影",
            value: "Tilt-shift photography",
          },
          {
            name: "我的世界",
            value: "Minecraft style",
          },
          {
            name: "马里奥",
            value: "Mario style",
          },
          {
            name: "宝可梦",
            value: "Pokemon style",
          },
          {
            name: "Mr.Doodles",
            value: "Mr.Doodles style",
          },
        ],
      },
    ],
  },
  {
    name: "技术",
    children: [
      {
        name: "渲染",
        tags: [
          {
            name: "Unreal Engine (虚幻引擎)",
            value: "Unreal Engine",
          },
          {
            name: "Octane Render (OC遣染)",
            value: "Octane Render",
          },
          {
            name: "Maxon Cinema 4D (渲染)",
            value: "Maxon Cinema 4D",
          },
          {
            name: "Architectural Visualization (建筑渲染)",
            value: "Architectural Visualization",
          },
          {
            name: "Corona Render (室内渣染)",
            value: "Corona Render",
          },
          {
            name: "Quixel Megascans Render (真实感)",
            value: "Quixel Megascans Render",
          },
          {
            name: "V-Ray (V射线)",
            value: "V-Ray",
          },
          {
            name: "3D Render",
            value: "3D Render",
          },
          {
            name: "Ink Render (墨水渲染)",
            value: "Ink render",
          },
          {
            name: "ZBrush (ZBrush 3D建模)",
            value: "ZBrush",
          },
        ],
      },
      {
        name: "Media",
        tags: [
          {
            name: "插画",
            value: "illustration",
          },
          {
            name: "照片",
            value: "photo",
          },
          {
            name: "绘画",
            value: "Painting",
          },
          {
            name: "喷绘",
            value: "Spray painting",
          },
          {
            name: "水彩画",
            value: "Watercolor Painting",
          },
          {
            name: "壁画",
            value: "Mural",
          },
          {
            name: "浮雕",
            value: "Bas-relief",
          },
          {
            name: "剪纸艺术",
            value: "Paper Cutting Art",
          },
          {
            name: "雕塑",
            value: "Sculpture",
          },
          {
            name: "挂毯",
            value: "Tapestry",
          },
        ],
      },
    ],
  },
  {
    name: "灯光",
    children: [
      {
        name: "灯光",
        tags: [
          {
            name: "暖光",
            value: "warm lighting",
          },
          {
            name: "冷光",
            value: "cold lighting",
          },
          {
            name: "柔光",
            value: "soft lighting",
          },
          {
            name: "强光",
            value: "hard lighting",
          },
          {
            name: "晨光",
            value: "morning lighting",
          },
          {
            name: "霓虹冷光",
            value: "neon cold lighting",
          },
          {
            name: "体积光线",
            value: "volumetric lighting",
          },
          {
            name: "荧光光线",
            value: "fluorescent lighting",
          },
        ],
      },
    ],
  },
  {
    name: "构图",
    children: [
      {
        name: "构图",
        tags: [
          {
            name: "非对称",
            value: "Asymmetrical composition",
          },
          {
            name: "背景虚化",
            value: "Bokeh",
          },
          {
            name: "居中构图",
            value: "centered composition",
          },
          {
            name: "对比构图",
            value: "contrasting composition",
          },
          {
            name: "对角线构图",
            value: "diagonal composition",
          },
          {
            name: "黄金比例",
            value: "golden ratio",
          },
          {
            name: "水平构图",
            value: "Horizontal",
          },
          {
            name: "整齐摆放",
            value: "knolling",
          },
          {
            name: "三分构图",
            value: "rule of thirds",
          },
          {
            name: "S 形线条",
            value: "S-shaped",
          },
          {
            name: "对称",
            value: "symmetrical",
          },
        ],
      },
    ],
  },
  {
    name: "视角",
    children: [
      {
        name: "视角",
        tags: [
          {
            name: "俯视图",
            value: "Top view / Bird View",
          },
          {
            name: "鸟瞰图",
            value: "Aerial view",
          },
          {
            name: "移轴摄影",
            value: "Tilt-shift",
          },
          {
            name: "卫星视图",
            value: "Satellite view",
          },
          {
            name: "底视图",
            value: "Bottom view",
          },
          {
            name: "产品视图",
            value: "Product view",
          },
          {
            name: "极端特写视图",
            value: "Extreme closeup view",
          },
          {
            name: "仰视",
            value: "Look up",
          },
          {
            name: "自拍视角",
            value: "Selfie angle",
          },
          {
            name: "第一人称视角",
            value: "First-person view",
          },
          {
            name: "等距视图",
            value: "Isometric view",
          },
          {
            name: "特写视图",
            value: "Closeup view",
          },
          {
            name: "高角度视图",
            value: "High angle view",
          },
          {
            name: "显微视角",
            value: "Microscopic view",
          },
          {
            name: "第三人称视角",
            value: "third-person perspective",
          },
          {
            name: "三点透视",
            value: "Three-point perspective",
          },
          {
            name: "两点透视",
            value: "two-point perspective",
          },
          {
            name: "肖像",
            value: "portrait",
          },
          {
            name: "立面透视",
            value: "Elevation perspective",
          },
          {
            name: "超广角镜头",
            value: "ultra wide shot",
          },
          {
            name: "横截面图",
            value: "cross-section view",
          },
          {
            name: "电影镜头",
            value: "cinematic shot",
          },
          {
            name: "焦点对准",
            value: "in focus",
          },
          {
            name: "广角镜头",
            value: "Wide-angle view",
          },
          {
            name: "中特写",
            value: "Medium Close-Up (MCU)",
          },
          {
            name: "中景",
            value: "Medium Shot (MS)",
          },
          {
            name: "远景",
            value: "Long Shot (LS)",
          },
          {
            name: "过肩景",
            value: "Over the Shoulder Shot",
          },
          {
            name: "松散景",
            value: "Loose Shot",
          },
          {
            name: "细节镜头",
            value: "Detail Shot (ECU)",
          },
          {
            name: "面部拍摄",
            value: "Face Shot (VCU)",
          },
          {
            name: "膝盖以上",
            value: "Knee Shot (KS)",
          },
          {
            name: "全身照",
            value: "Full Length Shot (FLS)",
          },
          {
            name: "胸部以上",
            value: "Chest Shot (McU)",
          },
          {
            name: "腰部以上",
            value: "Waist Shot (Ws)",
          },
          {
            name: "人在远方",
            value: "Extra Long Shot (ELS)",
          },
          {
            name: "头部以上",
            value: "Big Close-Up (BCU)",
          },
          {
            name: "自拍视角(远距离固定机位)",
            value: "Camera View from Above",
          },
          {
            name: "鱼眼视角",
            value: "Fish-eye Lens",
          },
          {
            name: "单人焦点",
            value: "Solo Focus",
          },
          {
            name: "背后焦点",
            value: "Back Focus",
          },
          {
            name: "正面面对",
            value: "Straight-On",
          },
          {
            name: "多视图",
            value: "Multiple Views",
          },
          {
            name: "主观视角",
            value: "POV",
          },
          {
            name: "手主观视角",
            value: "POV Hands",
          },
          {
            name: "侧边视角",
            value: "From Side",
          },
          {
            name: "头超出框外",
            value: "Head Out of Frame",
          },
          {
            name: "斜角镜头",
            value: "Dutch Angle",
          },
          {
            name: "强烈镜头",
            value: "Intense Angle",
          },
          {
            name: "戏剧性镜头",
            value: "Dramatic Angle",
          },
          {
            name: "动态镜头",
            value: "Dynamic Angle",
          },
          {
            name: "远景",
            value: "Wide Shot",
          },
          {
            name: "正前缩距",
            value: "Foreshortening",
          },
        ],
      },
    ],
  },
];
</script>
