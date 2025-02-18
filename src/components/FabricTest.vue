<script setup lang="ts">
import { onMounted } from "vue";
import { Canvas, IText } from "fabric";

let drawInst: Canvas;

onMounted(async () => {
  // 初始化 Canvas
  drawInst = new Canvas("canvas", {
    width: 800,
    height: 600,
    backgroundColor: "#fafafa",
  });
});

// 添加文本框函数
const addTextBox = () => {
  const text = new IText("点击编辑文字", {
    left: 100,
    top: 100,
    fontSize: 20,
    fill: "#000000",
    padding: 5,
    borderColor: "#000000",
    editingBorderColor: "#000000",
    cursorColor: "#000000",
    selectionColor: "rgba(0,0,0,0.1)",
  });

  drawInst.add(text);
  drawInst.setActiveObject(text);
}

// 删除选中对象
const deleteSelected = () => {
  const activeObject = drawInst.getActiveObject();

  if (activeObject) {
    drawInst.remove(activeObject);
    drawInst.requestRenderAll();
  }
}

// 下载SVG文件
const exportSVG = () => {
  // 获取SVG代码
  const svgData = drawInst.toSVG();
  // 创建Blob对象
  const blob = new Blob([svgData], { type: "image/svg+xml" });

  // 创建下载链接
  const element = document.createElement("a");
  element.download = "canvas-export.svg";
  element.href = URL.createObjectURL(blob);
  // 触发下载
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
}

// 下载PNG文件
const exportPNG = () => {
  // 将Canvas转换为数据URL
  const dataURL = drawInst.toDataURL({
    format: 'png',
    multiplier: 2
  });

  // 创建下载链接
  const element = document.createElement("a");
  element.download = "canvas-export.png";
  element.href = dataURL;
  // 触发下载
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

</script>

<template>
  <section>
    <h2>Fabric.js</h2>
    <div class="controls">
      <button id="addText" @click="addTextBox">添加文本框</button>
      <button id="deleteSelected" @click="deleteSelected">删除选中</button>
      <button id="exportSVG" @click="exportSVG">导出为 SVG</button>
      <button id="downloadSVG" @click="exportPNG">导出为 PNG</button>
    </div>
    <div id="canvas-container">
      <canvas id="canvas"></canvas>
    </div>
  </section>
</template>
