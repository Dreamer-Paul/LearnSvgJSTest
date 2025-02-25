<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import SmartArtEditor, {
  type ItemControlOption,
  type TextControlOption,
} from "../editor";
import { styleNames } from "../editor/style";
import { Plus, Trash } from "lucide-vue-next";
import { evaluateText, summaryToSmartArt } from "../services/api";
import { getTemplate, type ISmartArtTemplate, type TemplateCategory } from "../editor/template";

const inputText =
  ref(`流萤是米哈游开发的电子游戏《崩坏：星穹铁道》中的虚构角色，属于游戏中的组织“星核猎手”。她的真实身份是基因改造人AR-26710，曾是格拉默共和国的作战兵器“格拉默铁骑”的一员。流萤的角色设定和故事情节深受玩家和评论员的喜爱，尤其是在情感表达和人物成长方面。
流萤的外观特征包括银色的头发和独特的服饰设计，通常以机甲形态出现，化名为“萨姆”。她的设计灵感来源于“火萤”，象征着在黑暗中闪烁的光芒。流萤的故事围绕着她在格拉默共和国的悲惨经历展开，该共和国因虫群的入侵而覆灭。为了防止她的基因技术被外人利用，流萤体内被植入了名为“失熵症”的基因疾患，这使得她的身体逐渐消失，意识也变得模糊。
在格拉默的毁灭后，流萤成为了星际难民，最终加入了“星核猎手”，以寻找生命的意义。她的角色设定强调了对“死亡”和“命运”的深刻理解，展现了她在绝望中追寻希望的旅程。`);

const currentText = ref("");
const evaluationResult = ref<TemplateCategory[]>();
const evaluationResultJson = ref("");
const summaryTemplates = ref<ISmartArtTemplate[]>([]);
const summaryResult = ref<API.SummaryToSmartArtResponse | undefined>();

const addButtonOptions = ref<ItemControlOption[]>([]);
const controlTextOptions = ref<TextControlOption[]>([]);

const controlTextTextarea = ref<TextControlOption | undefined>(undefined);

let drawInst: SmartArtEditor;

onMounted(async () => {
  drawInst = new SmartArtEditor({
    el: "#svg-container",
    template: "converge2-v1--family",
    count: 4,
    // style: "test2",
    option: {
      "text-title": {
        text: "测试标题",
      },
      "text-1": {
        text: "图标的坐标有问题",
      },
      "icon-1": {
        name: "animal-horse--pets-animals--24x24",
      },
      "text-2": {
        text: "两个人来开发人家几十人团队的项目",
      },
      "icon-2": {
        name: "animal-horse--pets-animals--24x24",
      },
      "text-3": {
        text: "手搓功能 Bug 是真的巨多啊",
      },
      "icon-3": {
        name: "social-photobucket--logos--24x24",
      },
      "text-4": {
        text: "这个 AI 也好难调教",
      },
      "icon-4": {
        name: "social-photobucket--logos--24x24",
      },
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
      controlTextOptions.value = values;
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

const onClickEvaluate = async () => {
  try {
    const result = await evaluateText(inputText.value);
    evaluationResultJson.value = JSON.stringify(result, null, 2);
    evaluationResult.value = result.data.scores as TemplateCategory[];
  } catch (error) {
    console.error("Error evaluating text:", error);
    evaluationResultJson.value = "Error evaluating text.";
  }
};

const onClickSummary = async () => {
  if (evaluationResult.value === undefined) {
    alert("请先评分");
    return;
  }

  try {
    const result = await summaryToSmartArt(
      inputText.value,
      evaluationResult.value[0]
    );

    console.log("result", result.data.summary);

    const templates: ISmartArtTemplate[] = [];

    evaluationResult.value.forEach((item) => {
      const template = getTemplate(item, result.data.count);

      if (template) {
        templates.push(...template);
      }
    });

    if (templates.length === 0) {
      alert("生成失败");
      return;
    }

    summaryTemplates.value = templates;
    summaryResult.value = result.data;

    drawInst?.execDraw({
      template: templates[0].name,
      count: result.data.count,
      option: result.data.summary,
    });
  } catch (error) {
    console.error("Error summary text:", error);
  }
};

const onClickUseTemplate = (index: number) => {
  if (summaryResult.value === undefined) {
    alert("请先生成");
    return;
  }

  const item = summaryTemplates.value[index];

  drawInst?.execDraw({
    template: item.name,
    count: summaryResult.value.count,
    option: summaryResult.value.summary,
  });
}

const onClickTestRedraw = () => {
  drawInst?.execDraw({
    template: "converge-pins-v6--family",
    count: 3,
    option: {
      "text-title": { text: "流萤角色档案" },
      "text-1": { text: "基因改造战士" },
      "text-1-desc": { text: "代号AR-26710的格拉默铁骑" },
      "text-2": { text: "星际难民" },
      "text-2-desc": { text: "携带失熵症的流浪者" },
      "text-3": { text: "星核猎手" },
      "text-3-desc": { text: "化名萨姆的寻道者" },
    },
  });
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
    <pre v-if="evaluationResultJson">{{ evaluationResultJson }}</pre>
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
          v-model="currentText"
          @blur="onBlur"
        ></textarea>
      </div>
    </div>
    <div v-if="summaryTemplates.length > 0" class="style-selection">
      <h3>切换图形</h3>
      <p>
        <button v-for="(item, index) in summaryTemplates" @click="onClickUseTemplate(index)">
          {{ item.name }}
        </button>
      </p>
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
  border-radius: 1em;
}
</style>
