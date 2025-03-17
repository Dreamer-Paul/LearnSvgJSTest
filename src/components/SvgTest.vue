<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import SmartArtEditor, {
  type ItemControlOption,
  type TextControlOption,
} from "../editor";
import { styleNames } from "../editor/style";
import { Plus, Trash } from "lucide-vue-next";
import useEvaluation from "../hooks/use-evaluation";
import useSummary from "../hooks/use-summary";
import { getTemplate, type TemplateCategory } from "../editor/template";
import fakeData from "../editor/constants/fake-data";
import IconSearch from "./IconSearch.vue";

const inputText =
  ref(`流萤是米哈游开发的电子游戏《崩坏：星穹铁道》中的虚构角色，属于游戏中的组织“星核猎手”。她的真实身份是基因改造人AR-26710，曾是格拉默共和国的作战兵器“格拉默铁骑”的一员。流萤的角色设定和故事情节深受玩家和评论员的喜爱，尤其是在情感表达和人物成长方面。
流萤的外观特征包括银色的头发和独特的服饰设计，通常以机甲形态出现，化名为“萨姆”。她的设计灵感来源于“火萤”，象征着在黑暗中闪烁的光芒。流萤的故事围绕着她在格拉默共和国的悲惨经历展开，该共和国因虫群的入侵而覆灭。为了防止她的基因技术被外人利用，流萤体内被植入了名为“失熵症”的基因疾患，这使得她的身体逐渐消失，意识也变得模糊。
在格拉默的毁灭后，流萤成为了星际难民，最终加入了“星核猎手”，以寻找生命的意义。她的角色设定强调了对“死亡”和“命运”的深刻理解，展现了她在绝望中追寻希望的旅程。`);

const currentText = ref("");

const addButtonOptions = ref<ItemControlOption[]>([]);
const controlTextOptions = ref<TextControlOption[]>([]);
const controlIconOptions = ref<TextControlOption[]>([]);

const controlTextTextarea = ref<TextControlOption | undefined>(undefined);

let drawInst: SmartArtEditor;

onMounted(async () => {
  drawInst = new SmartArtEditor({
    el: "#svg-container",
    template: "converge2-v1--family",
    count: 4,
    style: "greenTree",
    option: {
      "text-title": {
        text: "测试标题",
        style: {
          fill: {
            color: "red",
          },
          stroke: {
            color: "black",
            // width: 3,
          },
        },
      },
      "text-1": {
        text: "图标的坐标有问题",
      },
      "icon-1": {
        name: "book",
      },
      "text-2": {
        text: "两个人来开发人家几十人团队的项目",
      },
      "icon-2": {
        name: "brain",
      },
      "text-3": {
        text: "手搓功能 Bug 是真的巨多啊",
      },
      "icon-3": {
        name: "heart-2",
      },
      "text-4": {
        text: "这个 AI 也好难调教",
      },
      "icon-4": {
        name: "profile",
      },
    },
    onUpdateControlButtons: (values) => {
      addButtonOptions.value = values;
    },
    onUpdateControlTexts: (values) => {
      controlTextOptions.value = values;
    },
    onUpdateControlIcons: (values) => {
      controlIconOptions.value = values;
    },
  });

  console.log("drawInst", drawInst);
});

const exportSVG = () => {
  drawInst?.export.svg();
};

const exportPNG = () => {
  drawInst?.export.png();
};

const controlTextTextareaRef = ref<HTMLTextAreaElement>();

const openTextarea = (item: TextControlOption) => {
  controlTextTextarea.value = item;

  const text = drawInst?.getText(item);

  if (!text) {
    return;
  }

  nextTick(() => {
    const input = controlTextTextareaRef.value;

    if (!input) {
      return;
    }

    input.value = text;
    input.focus();
  });
};

const onBlur = (ev: Event) => {
  if (!controlTextTextarea.value) {
    return;
  }

  console.log("onBlur", controlTextTextarea.value);

  drawInst?.updateText({
    ...controlTextTextarea.value,
    text: (ev.target as HTMLTextAreaElement).value,
  });

  controlTextTextarea.value = undefined;
};

const selectedIconControl = ref<TextControlOption | null>(null);

const openIconSearch = (item: TextControlOption) => {
  selectedIconControl.value = item;

  // 打开搜索框
  iconSearchRef.value?.open();
};

const onIconSelected = (icon: string) => {
  if (!selectedIconControl.value) return;

  drawInst?.updateIcon({
    ...selectedIconControl.value,
    name: icon,
  });

  selectedIconControl.value = null;
};

const iconSearchRef = ref();

//
// 评分
//
const { evaluationResult, evaluationResultJson, startEvaluation } =
  useEvaluation();

const onClickEvaluate = () => startEvaluation(inputText.value);

//
// 生成
//
const { summaryTemplates, summaryResults, startSummary } = useSummary();

const onClickSummary = async () => {
  if (evaluationResult.value.length === 0) {
    alert("请先评分");
    return;
  }

  await startSummary(inputText.value, evaluationResult.value);

  if (summaryResults.value.length === 0) {
    return;
  }

  console.log("summaryResults", summaryResults.value, summaryTemplates.value);

  drawInst?.execDraw({
    template: summaryTemplates.value[0][0].name,
    count: summaryResults.value[0].count,
    option: summaryResults.value[0].summary,
  });
};

const onClickUseTemplate = (cateIndex: number, index: number) => {
  if (!summaryResults.value) {
    alert("请先生成");
    return;
  }

  const item = summaryTemplates.value[cateIndex][index];

  console.log(
    "切换模板",
    item.name,
    item.type,
    summaryResults.value[cateIndex].summary
  );

  drawInst?.execDraw({
    template: item.name,
    count: summaryResults.value[cateIndex].count,
    option: summaryResults.value[cateIndex].summary,
  });
};

const onClickTestRedraw = () => {
  const types = fakeData.scores as TemplateCategory[];
  evaluationResult.value = types;

  summaryTemplates.value = types.map((type, index) => {
    const template = getTemplate(type, fakeData.results[index].count);

    console.log("fake 数据匹配 template", type, template);

    return template || [];
  });

  summaryResults.value = fakeData.results.map((result) => result);
};
</script>

<template>
  <section>
    <h2>输入待加工的文本</h2>
    <textarea class="input-text" v-model="inputText" rows="8"></textarea>
    <div class="controls">
      <button @click="onClickEvaluate">评分</button>
      <button @click="onClickSummary">生成</button>
      <button @click="onClickTestRedraw">测试切换图形</button>
    </div>
    <pre v-if="evaluationResultJson" class="code">{{
      evaluationResultJson
    }}</pre>
  </section>
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
      <IconSearch ref="iconSearchRef" @icon-selected="onIconSelected" />
      <div class="icon-controls">
        <span
          v-for="item in controlIconOptions"
          :style="{
            top: `${item.y}px`,
            left: `${item.x}px`,
            width: `${item.width}px`,
            height: `${item.height}px`,
          }"
          @click="openIconSearch(item)"
        >
        </span>
      </div>

      <div
        v-if="controlTextTextarea"
        :style="{
          position: 'absolute',
          fontSize: controlTextTextarea?.style?.font?.size + 'px',
          width: controlTextTextarea?.width + 'px',
          height: controlTextTextarea?.height + 'px',
          left: controlTextTextarea?.x + 'px',
          top: controlTextTextarea?.y + 'px',
        }"
      >
        <textarea
          ref="controlTextTextareaRef"
          class="svg--input"
          :style="{
            textAlign: controlTextTextarea.textAlign,
          }"
          v-model="currentText"
          @blur="onBlur"
        ></textarea>
      </div>
    </div>
    <div v-if="summaryTemplates.length > 0" class="style-selection">
      <h3>切换图形</h3>
      <div v-for="(category, cateIndex) in evaluationResult">
        <p>{{ category }}</p>
        <button
          v-for="(item, index) in summaryTemplates[cateIndex]"
          @click="onClickUseTemplate(cateIndex, index)"
        >
          {{ item.name }}
        </button>
      </div>
      <p></p>
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
.code {
  overflow: auto;
  max-height: 30em;
}

.input-text {
  width: 100%;
  padding: 1em;
  font: inherit;
}

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
  border-radius: 100px;
}

.text-controls span {
  display: block;
  cursor: pointer;
  position: absolute;
}

.text-controls span:hover {
  border: 2px solid #2292ff;
  border-radius: 0.5em;
}

.icon-controls span {
  display: block;
  cursor: pointer;
  position: absolute;
}

.icon-controls span:hover {
  border: 2px solid #2292ff;
  border-radius: 0.5em;
}
</style>
