<script setup lang="ts">
import { onMounted, reactive, type CSSProperties } from "vue";
import SmartArtEditor from "../editor";

const inputWrap = reactive({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  text: "",
  className: "",
  textAlign: undefined as CSSProperties["text-align"] | undefined,
});

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
          icon: "animal-horse--pets-animals--24x24",
        },
        {
          text: "为什么这个项目这么难做",
          icon: "social-photobucket--logos--24x24",
        },
        {
          text: "手搓功能 Bug 是真的巨多啊",
          icon: "animal-horse--pets-animals--24x24",
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
      inputWrap.textAlign = inputPosition.textAlign as CSSProperties["text-align"];
    },
    onUpdateText: (callback) => {
      if (inputWrap?.text && callback) {
        callback(inputWrap.className, inputWrap?.text, inputWrap?.width);
      }
    },
  });

  console.log("drawInst", drawInst);
});

const exportSVG = () => {
  drawInst?.exportSVG();
};

const exportPNG = () => {
  drawInst?.exportPNG();
};
</script>

<template>
  <section>
    <h2>SvgJS</h2>
    <div class="controls">
      <button @click="exportSVG">导出为 SVG</button>
      <button @click="exportPNG">导出为 PNG</button>
    </div>
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
          :style="{ textAlign: inputWrap.textAlign }"
          v-model="inputWrap.text"
        ></textarea>
      </div>
    </div>
  </section>
</template>
