<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { Svg } from "@svgdotjs/svg.js";
import SmartArtEditor from "../editor";

defineProps<{ msg: string }>();

const inputWrap = reactive({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  text: "",
  className: "",
});

let draw: Svg;
let drawInst: SmartArtEditor;

onMounted(async () => {
  drawInst = new SmartArtEditor({
    el: "#svg-container",
    template: "converge2-v1",
    data: {
      title: "测试",
      items: [
        {
          text: "坐标的问题怎么解决",
        },
        {
          text: "为什么这个项目这么难做",
        },
        {
          text: "手搓功能 Bug 是真的巨多啊",
        },
      ],
    },
    onInputPositionChange: (inputPosition) => {
      console.log("inputPosition", inputPosition);

      inputWrap.x = inputPosition.x;
      inputWrap.y = inputPosition.y;
      inputWrap.height = inputPosition.height;
      inputWrap.width = inputPosition.width;
      inputWrap.text = inputPosition.text;
      inputWrap.className = inputPosition.className;
    },
    onUpdateText: (callback) => {
      if (inputWrap?.text && callback) {
        callback(inputWrap.className, inputWrap?.text);
      }
    },
  });

  console.log("drawInst", drawInst);
});
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>{{ inputWrap.text }}</h2>

  <div class="svg--conatiner">
    <div id="svg-container"></div>

    <!-- 输入框 -->
    <div
      class="svg--input__container"
      :style="{
        width: inputWrap?.width + 'px',
        height: inputWrap?.height + 'px',
        left: inputWrap?.x + 'px',
        top: inputWrap?.y + 'px',
      }"
    >
      <textarea
        class="svg--input"
        style="text-align: left"
        v-model="inputWrap.text"
      ></textarea>
    </div>
  </div>

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
