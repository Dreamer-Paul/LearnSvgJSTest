<script setup lang="ts">
import { onMounted, reactive, ref, type CSSProperties } from "vue";
import SmartArtEditor, { type IButton } from "../editor";
import { styleNames } from "../editor/style";
import { Plus, Trash } from "lucide-vue-next";

const inputWrap = ref({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  text: "",
  className: "",
  textAlign: undefined as CSSProperties["text-align"] | undefined,
});

const addButtonOptions = ref<IButton[]>([]);

let drawInst: SmartArtEditor;

onMounted(async () => {
  drawInst = new SmartArtEditor({
    el: "#svg-container",
    template: "converge2-v1",
    data: {
      title: "测试",
      style: "test2",
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
    onUpdateAddButtons: (values) => {
      addButtonOptions.value = values;
    },
    onInputPositionChange: (inputPosition) => {
      console.log("inputPosition", inputPosition);

      inputWrap.value = {...inputPosition};
    },
    onUpdateText: (callback) => {
      if (inputWrap.value?.text && callback) {
        callback(inputWrap.value.className, inputWrap.value?.text, inputWrap.value?.width);
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

      <div class="add-remove-controls">
        <span
          v-for="item in addButtonOptions"
          :data-test="item.type"
          :style="{
            top: `${item.y}px`,
            left: `${item.x}px`,
            backgroundColor: item.type === 'add' ? '#2e41ff' : '#e10000',
          }"
          @click="
            item.type === 'add'
              ? drawInst?.addItem(item.index)
              : drawInst?.removeItem(item.index)
          "
        >
          <Plus v-if="item.type === 'add'" :size="16" />
          <Trash v-else :size="16" />
        </span>
      </div>

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
          v-show="inputWrap.x > 0"
          v-model="inputWrap.text"
        ></textarea>
      </div>
    </div>
    <div class="style-selection">
      <h3>切换样式</h3>
      <p>
        <button v-for="name in styleNames" @click="drawInst?.changeStyle(name)">
          {{ name }}
        </button>
      </p>
    </div>
  </section>
</template>
<style scoped>
.svg--conatiner:hover .add-remove-controls {
  opacity: 1;
}

.add-remove-controls {
  opacity: 0;
  transition: opacity 0.3s;
}

.add-remove-controls span {
  color: #fff;
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: pointer;
  position: absolute;
  background: red;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 100px;
}
</style>
