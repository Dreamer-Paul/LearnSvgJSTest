import {
  Element as SvgJSElement,
  Path,
  SVG,
  Text,
  type Svg,
} from "@svgdotjs/svg.js";
import SmartArtData, { type ISmartArtData } from "./data";
import SmartArtIcon from "./icon";
import SmartArtStyle from "./style";
import SmartArtText from "./text";
import SmartArtExport from "./export";
import SmartArtOption, { type ISmartArtOptionItem } from "./option";
import { getXY } from "./utils";

export interface ItemControlOption {
  x: number;
  y: number;
  type: "add" | "remove";
  index: number;
}

export interface TextControlOption {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  textAlign: "left" | "right" | "center";
}

interface SmartArtEditorBaseProps {
  template: string;
  count: number;
  option: Record<string, ISmartArtOptionItem>;
}

interface SmartArtEditorProps extends SmartArtEditorBaseProps {
  el: string;
  data: ISmartArtData;
  onUpdateControlButtons?: (options: ItemControlOption[]) => void;
  onUpdateControlTexts?: (options: TextControlOption[]) => void;
}

class SmartArtEditor {
  private template: string;
  private count: number = 0;
  private option: SmartArtOption;
  private data: SmartArtData;
  private draw: Svg;
  private icon: SmartArtIcon;
  private text: SmartArtText;
  private style: SmartArtStyle;

  export: SmartArtExport;

  // 背景
  private bgEl: SvgJSElement | undefined;
  // 文字
  private textEl: SvgJSElement[] = [];

  // 外部管理，操作控制符
  private itemControlOptions: ItemControlOption[] = [];
  private textPlaceholdersOptions: TextControlOption[] = [];

  // 图标
  private iconGroupsEl: SvgJSElement[] = [];

  // 回调
  private onUpdateAddButtons:
    | ((options: ItemControlOption[]) => void)
    | undefined;
  private onUpdateControlTexts:
    | ((options: TextControlOption[]) => void)
    | undefined;

  constructor(props: SmartArtEditorProps) {
    this.template = props.template;

    if (props.onUpdateControlButtons) {
      this.onUpdateAddButtons = props.onUpdateControlButtons;
    }

    if (props.onUpdateControlTexts) {
      this.onUpdateControlTexts = props.onUpdateControlTexts;
    }

    this.count = props.count;

    this.draw = SVG().addTo(props.el);

    this.option = new SmartArtOption(props.option);
    this.data = new SmartArtData(props.data);
    this.icon = new SmartArtIcon(this.draw);
    this.text = new SmartArtText(this.draw);
    this.style = new SmartArtStyle(this.draw);
    this.export = new SmartArtExport(this.draw);

    this.drawContext();
  }

  async getTemplate(templateName: string) {
    // 获取 SVG 文件内容
    const response = await fetch(
      `/template/${templateName}--${this.count}.svg`
    );
    const svgText = await response.text();

    // 解析 SVG 文件内容并添加到画布中
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // console.log(svgElement);

    const width = Number(svgElement.getAttribute("width") || 0);
    const height = Number(svgElement.getAttribute("height") || 0);

    return [svgElement.children[0].outerHTML, width, height];
  }

  /**
   * 根据当前模板重新绘制图形到画板
   */
  async drawContext() {
    const [str, width, height] = await this.getTemplate(this.template);

    // 目前这个数据里面一共有什么图（包括重复的）
    const a = this.option.getAllIconName();

    // Todo: 临时操作，写的比较粗糙
    const icons = await this.icon.fetchIcons(a);

    // Todo: 图标素材入库，下次最好不再请求图片资源
    a.forEach((i, index) => {
      this.icon.addToMap(i, icons[index]);
    });

    this.draw.clear();

    // 背景在最底层
    this.bgEl = this.draw.rect(width, height);

    // 图形内容
    this.draw.svg(str as string);
    this.draw.size(width, height);

    this.style.setBackgroundStyle(this.bgEl, this.data.style);

    // 设置渐变填充
    const gradient = this.draw.gradient("linear", (add) => {
      add.stop(0, "#ff0000");
      add.stop(1, "#0000ff");
    });

    this.prepareText();
    this.iconGroupsEl = this.icon.drawIcons(this.option);

    this.styleIcon();
    this.styleRect();

    this.createItemControl();
  }

  styleIcon() {
    const styleItem = this.style.getStyleItem(this.data.style);

    if (!styleItem || !styleItem.icon) {
      return;
    }

    this.iconGroupsEl.forEach((group, index) => {
      this.style.setIconStyle(group, styleItem, index);
    });
  }

  styleRect() {
    const styleItem = this.style.getStyleItem(this.data.style);

    if (!styleItem || !styleItem.rect) {
      return;
    }

    this.draw.find("#lines path").each((item, index) => {
      this.style.setRectStyle(item, styleItem, index);
    });
  }

  /**
   * 向画布外添加增删管理按钮
   */
  createItemControl() {
    // 重置
    this.itemControlOptions = [];

    // 获取添加和删除的按钮
    const placeholderEls = this.draw.find("[id^='bt-']");

    placeholderEls.each((item) => {
      const id = item.id();
      const index = parseInt(id.split("-").pop() || "0", 10) - 1;

      const { x, y } = getXY(item);

      let type: "add" | "remove" = "add";

      if (id.includes("add")) {
        type = "add";
      } else if (id.includes("remove")) {
        type = "remove";
      } else {
        // 异常情况，暂不处理
        return;
      }

      this.itemControlOptions.push({
        x,
        y,
        type,
        index,
      });

      item.remove();
    });

    this.onUpdateAddButtons?.(this.itemControlOptions);
  }

  // 绘制文字
  drawText({
    content,
    width,
    textAlign,
    element,
  }: {
    content: string;
    width: number;
    id: string;
    textAlign: "left" | "right" | "center";
    element?: Path;
  }) {
    const t = this.draw.text((add) => {
      const lines = this.text.wrapText(content, width);

      lines.forEach((line) => {
        const tspan = add.tspan(line.text).newLine();

        // 设置文本对齐方式
        if (textAlign === "left") {
          tspan.dx(0); // 左对齐
        } else if (textAlign === "right") {
          tspan.dx(width - line.width); // 右对齐
        } else {
          tspan.dx((width - line.width) / 2); // 居中对齐
        }
      });

      add.font({
        size: 24,
      });

      if (element) {
        add.translate(element.x() as number, (element.y() as number) + 24);
      }
    });

    return t;
  }

  renderTextUpdate({
    text,
    width,
    textAlign,
    textNode,
  }: {
    text: string;
    width: number;
    textAlign: "left" | "right" | "center";
    textNode: Text;
  }) {
    const t = textNode.text((add) => {
      const lines = this.text.wrapText(text, width);

      lines.forEach((line) => {
        const tspan = add.tspan(line.text).newLine();

        // 设置文本对齐方式
        if (textAlign === "left") {
          tspan.dx(0); // 左对齐
        } else if (textAlign === "right") {
          tspan.dx(width - line.width); // 右对齐
        } else {
          tspan.dx((width - line.width) / 2); // 居中对齐
        }
      });

      add.font({
        size: 24,
      });
    });

    return t;
  }

  /**
   * 存储原框架内包含的信息，渲染文字和编辑占位符
   */
  prepareText() {
    // 重置
    this.textPlaceholdersOptions = [];

    const elements = this.draw.find("[id^='tx-']");

    const g: Text[] = [];

    elements.each((el, index) => {
      const element = el as Path;
      const id = element.id();

      // 新版 keyName，根据 keyName 获取和存储节点设置
      const [_, align] = id.split("-", 2);
      let keyName = id.substring(id.indexOf("-", id.indexOf("-") + 1) + 1);

      // console.log("keyName", keyName, id.split("-", 3));

      const content = this.option.getText(keyName)?.text || "New Element";

      if (!content) {
        return;
      }

      const elementWidth = element.width() as number;

      const textAlign = (() => {
        if (align.includes("l")) {
          return "left";
        } else if (align.includes("r")) {
          return "right";
        } else if (align.includes("c")) {
          return "center";
        }

        return "left";
      })() as TextControlOption["textAlign"];

      g.push(
        this.drawText({
          textAlign,
          content: content,
          width: elementWidth,
          id: `${id}-text`,
          element,
        })
      );

      const { x, y } = getXY(el);

      this.textPlaceholdersOptions.push({
        id: keyName,
        x,
        y,
        width: el.width() as number,
        height: el.height() as number,
        index,
        textAlign,
      });

      el.remove();
    });

    this.textEl = g;
    this.onUpdateControlTexts?.(this.textPlaceholdersOptions);

    return g;
  }

  /**
   * 传入新的选项，重新绘制
   */
  execDraw(props: SmartArtEditorBaseProps) {
    if (props.template) {
      this.template = props.template;
    }

    this.count = props.count;
    this.option.setData(props.option);

    this.drawContext();
  }

  /**
   * 切换风格
   * @param {string} styleName
   */
  changeStyle(styleName: string) {
    this.data.updateStyle(styleName);

    this.bgEl && this.style.setBackgroundStyle(this.bgEl, this.data.style);
    this.styleIcon();
    this.styleRect();
  }

  /**
   * 获取文本
   * @param data
   * @returns
   */
  getText(data: TextControlOption) {
    return this.option.getText(data.id)?.text || "";
  }

  /**
   * 更新文本
   * @param data
   */
  updateTextNew(data: TextControlOption & { text: string }) {
    console.log("updateTextNew", data);

    const textNode = this.textEl[data.index] as Text;

    this.renderTextUpdate({
      text: data.text,
      width: data.width,
      textAlign: data.textAlign,
      textNode,
    });

    this.option.setItem(`text-${data.id}`, { text: data.text });
  }

  /**
   * 添加新的元素
   * @param index
   */
  addItem(index: number) {
    this.option.addItem(index, { text: "New Element" });
    this.count++;

    this.drawContext();
  }
  /**
   * 移除元素
   * @param index
   */
  removeItem(index: number) {
    this.option.removeItem(index);
    this.count--;

    this.drawContext();
  }
}

export default SmartArtEditor;
