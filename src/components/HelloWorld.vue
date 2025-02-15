<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Path, Svg, SVG } from "@svgdotjs/svg.js";

defineProps<{ msg: string }>();

let draw: Svg;

onMounted(async () => {
  draw = SVG().addTo("#svg-container").size("816", "504");
  draw.rect("100%", "100%").fill("skyblue");

  // 获取 SVG 文件内容
  const response = await fetch("/prism-rays-v1--family--4.svg");
  const svgText = await response.text();

  // 解析 SVG 文件内容并添加到画布中
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  draw.svg(svgElement.outerHTML);

  let index = 1;
  while (index <= 4) {
    const pathElement = draw.findOne(`#tx-lc-${index}`) as Path;

    if (pathElement) {
      const matrix = pathElement.transform();
      const bbox = pathElement.bbox();
      const transformedX = matrix.translateX;
      const transformedY = matrix.translateY - Math.round(bbox.height / 2);

      console.log(bbox.height);

      // 创建一个外部 div 元素
      const foreignObject = draw
        .foreignObject(bbox.width, 24 * 1.5)
        .move(transformedX, transformedY)
        .cy(transformedY)
      foreignObject.add(
        `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 24px; color: red;">重叠富文本 ${index}</div>`
      );
    }

    index++;
  }
});

const exportSVG = () => {
  const svgData = draw.svg();
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "exported-image.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportPNG = () => {
  const svgData = draw.svg();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob!);
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported-image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };
  img.src = "data:image/svg+xml;base64," + btoa(svgData);
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div id="svg-container"></div>

  <button @click="exportSVG">导出为 SVG</button>
  <button @click="exportPNG">导出为 PNG</button>

  <svg
    width="100%"
    height="100%"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="200"
      y="50"
      text-anchor="start"
      fill="black"
      style="font-size: 40px"
    >
      2我是中国人
    </text>
    <text
      x="200"
      y="100"
      text-anchor="middle"
      fill="black"
      style="font-size: 40px"
    >
      3我是中国人
    </text>
    <text
      x="200"
      y="150"
      text-anchor="end"
      fill="black"
      style="font-size: 40px"
    >
      4我是中国人
    </text>
    <path d="M200,0 V200 M0,100 H400" stroke="red" />
  </svg>
</template>
