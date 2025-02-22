<script setup lang="ts">
import { nextTick, onMounted, ref, type CSSProperties } from "vue";
import SmartArtEditor, { type IButton, type TextPlaceHolderOption } from "../editor";
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
const controlTextOptions = ref<TextPlaceHolderOption[]>([]);

const controlTextTextarea = ref<TextPlaceHolderOption | undefined>(undefined);

let drawInst: SmartArtEditor;

onMounted(async () => {
  drawInst = new SmartArtEditor({
    el: "#svg-container",
    template: "converge2-v1",
    elOptions: {
      "title": {
        text: "测试标题",
      },
      "item-1": {
        text: "图标的坐标有问题",
      },
      "icon-1": {
        icon: "animal-horse--pets-animals--24x24",
      },
      "item-2": {
        text: "两个人来开发人家几十人团队的项目",
      },
      "icon-2": {
        icon: "animal-horse--pets-animals--24x24",
      },
      "item-3": {
        text: "手搓功能 Bug 是真的巨多啊",
      },
      "icon-3": {
        icon: "social-photobucket--logos--24x24",
      }
    },
    data: {
      title: "测试",
      style: "test2",
      items: [
        {
          text: "图标的坐标有问题",
          icon: "animal-horse--pets-animals--24x24",
        },
        {
          text: "为什么这个项目这么难做",
          icon: "social-photobucket--logos--24x24",
        },
        {
          text: "两个人来开发人家几十人团队的项目",
          icon: "animal-horse--pets-animals--24x24",
        },
        {
          text: "手搓功能 Bug 是真的巨多啊",
          icon: "social-photobucket--logos--24x24",
        },
      ],
    },
    onUpdateControlButtons: (values) => {
      addButtonOptions.value = values;
    },
    onUpdateControlTexts: (values) => {
      controlTextOptions.value = Object.keys(values).map((item) => values[item]);
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

const controlTextTextareaRef = ref<HTMLTextAreaElement>();

const openTextarea = (item) => {
  controlTextTextarea.value = item;

  nextTick(() => {
    controlTextTextareaRef.value?.focus();
  });
}

const onBlur = (ev) => {
  console.log(ev.target.value, controlTextTextarea.value);

  drawInst?.updateTextNew(
    {
      ...controlTextTextarea.value,
      text: ev.target.value,
    }
  );

  controlTextTextarea.value = undefined;
}
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

      <div class="text-controls">
        <span
          v-for="item in controlTextOptions"
          :style="{
            top: `${item.y}px`,
            left: `${item.x}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
          }"
          @click="openTextarea(item)"
        >
        </span>
      </div>

      <div
        v-if="controlTextTextarea"
        :style="{
          position: 'absolute',
          width: controlTextTextarea?.width + 'px',
          height: controlTextTextarea?.height + 'px',
          left: controlTextTextarea?.x + 'px',
          top: controlTextTextarea?.y + 'px',
        }"
      >
        <textarea
          ref="controlTextTextareaRef"
          class="svg--input"
          :style="{ textAlign: controlTextTextarea.textAlign }"
          v-model="inputWrap.text"
          @blur="onBlur"
        ></textarea>
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

.text-controls span {
  display: block;
  cursor: pointer;
  position: absolute;
}

.text-controls span:hover {
  border: 2px solid #2292ff;
  border-radius: 1em;
}
</style>
