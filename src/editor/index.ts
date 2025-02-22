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

interface SmartArtEditorProps {
  el: string;
  template: string;
  option: Record<string, ISmartArtOptionItem>;
  data: ISmartArtData;
  onUpdateControlButtons: (v: ItemControlOption[]) => void;
  onUpdateControlTexts: (options: TextControlOption[]) => void;
}

class SmartArtEditor {
  private template: string;
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
  private textPlaceholdersOptions: Record<string, TextControlOption> = {};

  // 图标
  private iconGroupsEl: SvgJSElement[] = [];

  // 回调
  private onUpdateAddButtons: (v: ItemControlOption[]) => void;
  private onUpdateControlTexts: (options: TextControlOption[]) => void;

  constructor(props: SmartArtEditorProps) {
    this.template = props.template;
    this.onUpdateAddButtons = props.onUpdateControlButtons;
    this.onUpdateControlTexts = props.onUpdateControlTexts;

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
      `/${templateName}--family--${this.data.count}.svg`
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
    const a = this.data.getIcons();

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
    this.iconGroupsEl = this.icon.drawIcons(this.data);

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

      if (id.includes("add")) {
        this.itemControlOptions.push({
          x: item.x() as number,
          y: item.y() as number,
          type: "add",
          index,
        });

        item.remove();
      } else if (id.includes("remove")) {
        this.itemControlOptions.push({
          x: item.x() as number,
          y: item.y() as number,
          type: "remove",
          index,
        });

        item.remove();
      }
    });

    this.onUpdateAddButtons(this.itemControlOptions);
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

    // if (!textNode) {
    //   group.addClass(`${id}-group`); // 为 g 元素添加类名
    // }

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
    const elements = this.draw.find("[id^='tx-']");

    const g: Text[] = [];

    elements.each((el, index) => {
      const element = el as Path;
      const id = element.id();

      // 新版 keyName，根据 keyName 获取和存储节点设置
      const [_, align, keyName] = id.split("-");

      console.log("keyName", keyName, align);

      const content = this.option.getText(keyName)?.text;

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

      this.textPlaceholdersOptions[id] = {
        id: `text-${keyName}`,
        x: el.x() as number,
        y: el.y() as number,
        width: el.width() as number,
        height: el.height() as number,
        index,
        textAlign,
      };

      // el.remove();
    });

    this.textEl = g;
    this.onUpdateControlTexts(this.textPlaceholdersOptions);

    return g;
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

  updateTextNew(data: TextControlOption & { text: string }) {
    console.log("updateTextNew", data);

    const textNode = this.textEl[data.index] as Text;

    this.renderTextUpdate({
      text: data.text,
      width: data.width,
      textAlign: data.textAlign,
      textNode,
    });

    this.option.setItem(data.id, { text: data.text });
  }

  addItem(index: number) {
    this.data.addItem(index);
    this.drawContext();
  }
  removeItem(index: number) {
    this.data.removeItem(index);
    this.drawContext();
  }
}

export default SmartArtEditor;
