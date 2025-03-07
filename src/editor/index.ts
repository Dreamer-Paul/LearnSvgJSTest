import {
  Element as SvgJSElement,
  Path,
  SVG,
  Text,
  type Svg,
  G,
  Element,
  type FontData,
} from "@svgdotjs/svg.js";
import SmartArtIcon from "./icon";
import SmartArtStyle, { type IStyle } from "./style";
import SmartArtText from "./text";
import SmartArtExport from "./export";
import SmartArtOption, { type ISmartArtOptionItem } from "./option";
import {
  getAlign,
  getBoundingClientRect,
  getIconPosition,
  getTextPosition,
} from "./utils";

export interface ItemOption {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PatternItemOption extends ItemOption {
  id: string;
  path: string;
}

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
  style?: IStyle;
  textAlign: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
}

export interface SkeletonStructures {
  text: TextControlOption[];
  icon: TextControlOption[];
  pattern: PatternItemOption[];
  control: ItemControlOption[];
}

interface SmartArtEditorBaseProps {
  template: string;
  count: number;
  style?: string;
  option: Record<string, ISmartArtOptionItem>;
}

interface SmartArtEditorProps extends SmartArtEditorBaseProps {
  el: string;
  onUpdateControlButtons?: (options: ItemControlOption[]) => void;
  onUpdateControlTexts?: (options: TextControlOption[]) => void;
}

class SmartArtEditor {
  private template: string;
  private count: number = 0;
  private option: SmartArtOption;
  private draw: Svg;
  private icon: SmartArtIcon;
  private text: SmartArtText;
  private style: SmartArtStyle;
  private _style: string = "default";

  export: SmartArtExport;

  // 背景
  private bgEl: SvgJSElement | undefined;
  // 文字
  private textEl: SvgJSElement[] = [];

  // 骨架图结构属性
  private skeletonStructures: SkeletonStructures = {
    text: [],
    icon: [],
    pattern: [],
    control: [],
  };

  // 外部管理，操作控制符
  private itemControlOptions: ItemControlOption[] = [];
  private textPlaceholdersOptions: TextControlOption[] = [];
  private iconPlaceholdersOptions: TextControlOption[] = [];

  // 图标
  private iconGroupsEl: SvgJSElement[] = [];

  private patternGroupsEl: SvgJSElement[] = [];

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

    if (props.style) {
      this._style = props.style;
    }

    this.draw = SVG().addTo(props.el);

    this.option = new SmartArtOption(props.option);
    this.icon = new SmartArtIcon(this.draw);
    this.text = new SmartArtText(this.draw);
    this.style = new SmartArtStyle(this.draw);
    this.export = new SmartArtExport(this.draw);

    this.drawContext();
  }

  async getTemplate(templateName: string) {
    // 获取 SVG 文件内容
    const response = await fetch(
      `/templates/${templateName}--${this.count}.svg`
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
   * 获取到骨架图之后，提取里面的结构，重新绘制
   */
  async prepareTemplate() {
    // 重置
    this.skeletonStructures.text = [];
    this.skeletonStructures.icon = [];
    this.skeletonStructures.pattern = [];
    this.skeletonStructures.control = [];

    this.prepareText();
    this.prepareIcon();
    this.preparePattern();
    this.prepareControl();
  }

  async prepareText() {
    // 获取文本框区域
    this.textPlaceholdersOptions = [];

    const getFontStyle = (keyName: string) => {
      if (keyName.includes("title")) {
        return { weight: "bold", size: 28 };
      }

      if (keyName.includes("desc")) {
        return { opacity: 0.6, size: 16 };
      }

      return { size: 20 };
    };

    this.draw.find("[id^='tx-']").each((el, index) => {
      const element = el as Path;
      const id = element.id();

      // 新版 keyName，根据 keyName 获取和存储节点设置
      const align = id.split("-", 2)[1];
      const keyName = id.substring(id.indexOf("-", id.indexOf("-") + 1) + 1);

      const [textAlign, verticalAlign] = getAlign(align);
      const { x, y, width, height } = getTextPosition(el);

      const textItem = {
        id: keyName,
        x,
        y,
        width: width || (el.width() as number),
        height: height || (el.height() as number),
        index,
        style: {
          font: getFontStyle(keyName),
        },
        textAlign,
        verticalAlign,
      };

      this.skeletonStructures.text.push({ ...textItem });
      // 这里复制一份的原因是，实际文本的位置可能发生改变，需要基于原骨架图的坐标做对齐
      this.textPlaceholdersOptions.push({ ...textItem });
    });
  }

  async prepareIcon() {
    this.iconPlaceholdersOptions = [];

    this.draw.find("[id^='ic-']").each((el, index) => {
      const id = el.id();

      // 新版 keyName，根据 keyName 获取和存储节点设置
      const keyName = id.substring(id.indexOf("-", id.indexOf("-") + 1) + 1);

      const { x, y } = getIconPosition(el);

      const iconItem = {
        id: keyName,
        x,
        y,
        width: el.width() as number,
        height: el.height() as number,
        index,
        textAlign: "center" as TextControlOption["textAlign"],
      };

      this.skeletonStructures.icon.push({ ...iconItem });
      this.iconPlaceholdersOptions.push({ ...iconItem });
    });
  }

  async preparePattern() {
    this.draw.find("#lines [id^='g-']").each((el) => {
      const id = el.id();
      const keyName = id.split("-", 2)[1];

      const pathEl = el.findOne("path") as Element | null;

      if (!pathEl) {
        return;
      }

      console.log("preparePatternS", keyName);

      const { x, y } = getBoundingClientRect(pathEl);

      this.skeletonStructures.pattern.push({
        id: keyName,
        x,
        y,
        width: pathEl.width() as number,
        height: pathEl.height() as number,
        path: pathEl.attr("d"),
      });
    });
  }

  /**
   * 向画布外添加增删管理按钮
   */
  prepareControl() {
    // 重置
    this.itemControlOptions = [];

    // 获取添加和删除的按钮
    const placeholderEls = this.draw.find("[id^='bt-']");

    placeholderEls.each((item) => {
      const id = item.id();
      const index = parseInt(id.split("-").pop() || "0", 10) - 1;

      const { x, y } = getIconPosition(item);

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

  /**
   * 补全选项设置
   */
  async fillOptions() {
    // 新模板的 Options 包含什么 Keys，做补全和删除
    const optionKeys = [
      ...this.skeletonStructures.text.map((item) => `text-${item.id}`),
      ...this.skeletonStructures.icon.map((item) => `icon-${item.id}`),
    ];

    const nextOption: Record<string, ISmartArtOptionItem> = {};

    optionKeys.forEach((key) => {
      const item = this.option.getItem(key);

      if (item) {
        nextOption[key] = item;
      } else if (key.startsWith("text")) {
        nextOption[key] = { text: "New Element" };
      } else if (key.startsWith("icon")) {
        nextOption[key] = { name: "bug-line" };
      }
    });

    this.option.setData(nextOption);
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
      icons[index] && this.icon.addToMap(i, icons[index]);
    });

    this.draw.clear();

    // 图形内容
    this.draw.svg(str as string);
    this.draw.size(width, height);

    // 第一步，获取骨架图结构数据
    this.prepareTemplate();
    // 第二步，根据骨架图结构数据，补全选项设置
    this.fillOptions();
    // 第三步，清空画板，开始绘制
    this.draw.clear();
    // 第四步，绘制骨架图
    this.bgEl = this.draw.rect(width, height);
    this.style.setBackgroundStyle(this.bgEl, this._style);

    const styleItem = this.style.getStyleItem(this._style);

    // 画元素
    this.patternGroupsEl = this.skeletonStructures.pattern.map(
      (item, index) => {
        const g = this.draw.group();
        g.id(`g-${item.id}`);
        g.path(item.path);

        if (item.x && item.y) {
          g.translate(item.x, item.y);
        }

        if (styleItem?.rect) {
          this.style.applyStyle(g, styleItem.rect, index);
        }

        return g;
      }
    );

    // 画文字
    this.textEl = this.skeletonStructures.text.map((item) => {
      const { x, y, id, textAlign, verticalAlign, width, height, style } = item;

      const option = this.option.getText(id);

      if (!option) {
        return;
      }

      const text = this.drawText({
        textAlign,
        text: option.text,
        width,
        style: {
          // 默认初始化的样式
          ...style,
          // 选项的样式，优先级更高
          ...option.style,
        },
      });

      const textBbox = text.bbox();

      const centerX = x + (width - textBbox.width) / 2;

      // 弥补基线需要的高度
      const offsetY = (style?.font?.size as number) || 0;
      // 靠顶部对齐
      let bottomY = y + offsetY;

      if (verticalAlign === "middle") {
        bottomY = y + (height - textBbox.height) / 2 + offsetY;
      } else if (verticalAlign === "bottom") {
        bottomY = y + height - textBbox.height + offsetY;
      }

      text.translate(x, bottomY);

      return text;
    }) as SvgJSElement[];

    this.onUpdateControlTexts?.(this.textPlaceholdersOptions);

    // 画图标
    this.iconGroupsEl = this.skeletonStructures.icon.map((item, index) => {
      const option = this.option.getIcon(item.id);

      if (!option) {
        return;
      }

      const g = this.icon.drawIcon(item, option.name);

      let aa;
      if (typeof styleItem?.icon === "function") {
        aa = styleItem.icon(index);
      } else {
        aa = styleItem?.icon;
      }

      if (g) {
        this.style.applyStyle(g, this.style.mixStyle(aa, option.style), index);
      }

      return g;
    }) as G[];
  }

  // 绘制文字
  drawText({
    text,
    width,
    textAlign,
    style,
  }: {
    text: string;
    width: number;
    textAlign: "left" | "right" | "center";
    style: IStyle;
    node?: Text;
  }) {
    const t = this.draw.text((add) => {
      const lines = this.text.wrapText(text, width, style.font);

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

      style.font && add.font(style.font);
      style.fill && add.fill(style.fill);
      style.stroke && add.stroke(style.stroke);
    });

    return t;
  }

  updateDrawText({
    text,
    width,
    textAlign,
    style,
    node,
  }: {
    text: string;
    width: number;
    textAlign: "left" | "right" | "center";
    style?: object;
    node: Text;
  }) {
    const t = node.text((add) => {
      const lines = this.text.wrapText(text, width, style);

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
    });

    return t;
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
    this._style = styleName;

    this.bgEl && this.style.setBackgroundStyle(this.bgEl, this._style);

    const styleItem = this.style.getStyleItem(this._style);

    // Todo: 装饰性元素暂时没有 Options 自定义样式
    this.patternGroupsEl.forEach((item, index) => {
      if (styleItem?.rect) {
        this.style.applyStyle(item, styleItem.rect, index);
      }
    });

    // 修改文字样式
    // Todo

    // 修改图标样式
    this.skeletonStructures.icon.forEach((item, index) => {
      const option = this.option.getIcon(item.id);

      if (option) {
        const g = this.iconGroupsEl[index];

        let aa;
        if (typeof styleItem?.icon === "function") {
          aa = styleItem.icon(index);
        } else {
          aa = styleItem?.icon;
        }

        if (g) {
          this.style.applyStyle(
            g,
            this.style.mixStyle(aa, option.style),
            index
          );
        }

        return g;
      }
    });
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
  updateText(data: TextControlOption & { text: string }) {
    console.log("updateTextNew", data);

    const node = this.textEl[data.index] as Text;
    const option = this.option.getText(data.id);

    if (!node || !option) {
      return;
    }

    this.updateDrawText({
      text: data.text,
      width: data.width,
      style: {
        ...data.style,
        ...option.style,
      },
      textAlign: data.textAlign,
      node,
    });

    this.option.setItem(`text-${data.id}`, { text: data.text });
  }

  /**
   * 添加新的元素
   * @param index
   */
  addItem(index: number) {
    this.option.addItem(index);
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
