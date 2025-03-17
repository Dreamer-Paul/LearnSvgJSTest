import {
  Element as SvgJSElement,
  Path,
  SVG,
  Text,
  type Svg,
  G,
  Element,
} from "@svgdotjs/svg.js";
import SmartArtIcon from "./icon";
import SmartArtStyle, { type IStyle } from "./style";
import SmartArtText from "./text";
import SmartArtExport from "./export";
import SmartArtOption, { type ISmartArtOptionItem } from "./option";
import {
  clearStyle,
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

export interface ShapeItemOption {
  id: string;
  elements: SvgJSElement[];
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
  shapes: ShapeItemOption[];
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
  onUpdateControlIcons?: (options: TextControlOption[]) => void;
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
    shapes: [],
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
  private onUpdateControlIcons:
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

    if (props.onUpdateControlTexts) {
      this.onUpdateControlIcons = props.onUpdateControlIcons;
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
    this.skeletonStructures.shapes = [];
    this.skeletonStructures.control = [];

    this.prepareText();
    this.prepareIcon();
    this.preparePattern();
    this.prepareShapes();
    this.prepareControl();
  }

  async prepareText() {
    // 获取文本框区域
    this.textPlaceholdersOptions = [];

    const getFontStyle = (keyName: string) => {
      if (keyName.includes("title")) {
        return { weight: "bold", size: 30 };
      }

      if (keyName.includes("desc")) {
        return { opacity: 0.6, size: 16 };
      }

      return { size: 20 };
    };

    this.draw.find("[id^='tx-']").each((el, index) => {
      const element = el as Path;
      const id = element.id();

      // 根据 keyName 获取和存储节点设置
      const align = id.split("-", 2)[1];
      let keyName = id.substring(id.indexOf("-", id.indexOf("-") + 1) + 1);

      // V2 版本的 ID
      if (id.includes(":")) {
        keyName = id.split(":")[1];
      }

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

    this.draw.find("[id^='ic-'], [id^='ic:']").each((el, index) => {
      const id = el.id();

      // 根据 keyName 获取和存储节点设置
      let keyName = id.substring(id.indexOf("-", id.indexOf("-") + 1) + 1);

      // V2 版本的 ID
      if (id.includes(":")) {
        keyName = id.split(":")[1];
      }

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
    this.draw.find("#lines [id^='g-'], #patterns [id^='pt']").each((el) => {
      const id = el.id();

      // 根据 keyName 获取和存储节点设置
      let keyName = id.split("-", 2)[1];

      // V2 版本的 ID
      if (id.includes(":")) {
        keyName = id.split(":")[1];
      }

      let pathEl;
      if (el.node.tagName === "path") {
        pathEl = el;
      } else {
        pathEl = el.findOne("path") as Element | null;
      }

      if (!pathEl) {
        return;
      }

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

  async prepareShapes() {
    this.draw.find("#objects [id^='ob']").each((el) => {
      const id = el.id();

      // 根据 keyName 获取和存储节点设置
      let keyName = id.split(":")[1];

      let elements = [];

      if (el.node.tagName === "path") {
        elements.push(el);
      } else if (el.node.tagName === "rect") {
        elements.push(el);
      }
      // 组元素分别拿出里面所有元素，清理样式
      else if (el.node.tagName === "g") {
        const g = this.draw.group();
        g.id(`g-${keyName}`);

        el.find("path").each((p) => {
          clearStyle(p, ["d"]);
          g.add(p);
        });

        elements.push(g);
      }

      if (elements.length === 0) {
        return;
      }

      console.log("elements", elements);

      this.skeletonStructures.shapes.push({
        id: keyName,
        elements,
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
      let index = parseInt(id.split("-").pop() || "0", 10) - 1;

      // V2 版本的 ID
      if (id.includes(":")) {
        index = parseInt(id.split(":")[1] || "0", 10) - 1;
      }

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
    await this.icon.fetchIcons([...a, "bug-line"]);

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
    const patternGroup = this.draw.group().id("patterns");

    this.patternGroupsEl = this.skeletonStructures.pattern.map(
      (item, index) => {
        const g = patternGroup.group();
        g.id(`g-${item.id}`);
        g.path(item.path);

        if (item.x && item.y) {
          g.translate(item.x, item.y);
        }

        if (styleItem?.pattern) {
          this.style.applyStyle(g, styleItem.pattern, index, item.id);
        }

        return g;
      }
    );

    const shapeGroup = this.draw.group().id("shapes");

    this.skeletonStructures.shapes.forEach((item) => {
      item.elements.forEach((el) => {
        let templateStyle;
        if (typeof styleItem?.shape === "function") {
          // Todo: 改成用 id
          templateStyle = styleItem?.shape(0);
        } else {
          templateStyle = styleItem?.shape;
        }

        // 线条元素
        if (el.attr("fill") === "none") {
        } else if (styleItem?.shape) {
          this.style.applyStyle(el, styleItem.shape, 0);
        }

        shapeGroup.add(el);
      });

      // Todo: 暂时没有设置样式的功能

      // return path;
    });

    // 画文字
    this.textEl = this.skeletonStructures.text.map((item, index) => {
      const { x, y, id, textAlign, verticalAlign, width, height, style } = item;

      const option = this.option.getText(id);

      if (!option) {
        return;
      }

      let templateStyle;
      if (typeof styleItem?.text === "function") {
        templateStyle = styleItem.text(index, item.id);
      } else {
        templateStyle = styleItem?.text;
      }

      const mixedStyle = this.style.mixStyle(
        style,
        templateStyle,
        option.style
      );

      const text = this.drawText({
        textAlign,
        text: option.text,
        width,
        style: mixedStyle,
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

      // 更新外部占位符的位置
      this.textPlaceholdersOptions[index] = {
        ...this.textPlaceholdersOptions[index],
        height: textBbox.height,
        x,
        y: bottomY - offsetY,
      };

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

      let templateStyle;
      if (typeof styleItem?.icon === "function") {
        templateStyle = styleItem.icon(index, item.id);
      } else {
        templateStyle = styleItem?.icon;
      }

      if (g) {
        this.style.applyStyle(
          g,
          this.style.mixStyle(templateStyle, option.style),
          index,
          item.id,
        );
      }

      return g;
    }) as G[];

    this.onUpdateControlIcons?.(this.iconPlaceholdersOptions);
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
    index,
  }: {
    text: string;
    width: number;
    textAlign: "left" | "right" | "center";
    style?: IStyle;
    node: Text;
    index: number;
  }) {
    const t = node.text((add) => {
      const lines = this.text.wrapText(text, width, style?.font);

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

      if (style) {
        this.style.clearStyle(add);
        this.style.applyTextStyle(add, style, index);
      }
    });

    // 重新垂直居中
    const { x, y, verticalAlign, height } = this.skeletonStructures.text[index];

    const textBbox = t.bbox();

    // 弥补基线需要的高度
    const offsetY = (style?.font?.size as number) || 0;
    // 靠顶部对齐
    let bottomY = y + offsetY;

    if (verticalAlign === "middle") {
      bottomY = y + (height - textBbox.height) / 2 + offsetY;
    } else if (verticalAlign === "bottom") {
      bottomY = y + height - textBbox.height + offsetY;
    }

    // ! 这里是覆盖之前的设置，所以和初始化的时候调用的不同
    t.transform({
      translateX: x,
      translateY: bottomY,
    });

    // 更新外部占位符的位置
    this.textPlaceholdersOptions[index] = {
      ...this.textPlaceholdersOptions[index],
      height: textBbox.height,
      x,
      y: bottomY - offsetY,
    };

    this.onUpdateControlTexts?.(this.textPlaceholdersOptions);

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

    // 与内容有关的装饰性元素
    // Todo: 装饰性元素暂时没有 Options 自定义样式
    this.skeletonStructures.pattern.forEach((item, index) => {
      const node = this.patternGroupsEl[index];

      if (!styleItem?.pattern) {
        return;
      }

      this.style.applyStyle(node, styleItem.pattern, index, item.id);
    });

    // 与内容无关的装饰性元素
    this.skeletonStructures.shapes.forEach((item, index) => {
      if (!styleItem?.shape) {
        return;
      }

      item.elements.forEach((el) => {
        this.style.applyStyle(el, styleItem.shape, index);
      });
    });

    // 修改文字样式
    this.skeletonStructures.text.forEach((item, index) => {
      const node = this.textEl[index] as Text;
      const option = this.option.getText(item.id);

      if (!option) {
        return;
      }

      let templateStyle;
      if (typeof styleItem?.text === "function") {
        templateStyle = styleItem.text(index, item.id);
      } else {
        templateStyle = styleItem?.text;
      }

      const mixedStyle = this.style.mixStyle(
        item.style,
        templateStyle,
        option.style
      );

      this.updateDrawText({
        text: option.text,
        width: item.width,
        textAlign: item.textAlign,
        style: mixedStyle,
        node,
        index,
      });
    });

    // 修改图标样式
    this.skeletonStructures.icon.forEach((item, index) => {
      const option = this.option.getIcon(item.id);

      if (option) {
        const g = this.iconGroupsEl[index];

        let templateStyle;
        if (typeof styleItem?.icon === "function") {
          templateStyle = styleItem.icon(index, item.id);
        } else {
          templateStyle = styleItem?.icon;
        }

        if (g) {
          this.style.applyStyle(
            g,
            this.style.mixStyle(templateStyle, option.style),
            index,
            item.id,
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

    const styleItem = this.style.getStyleItem(this._style);

    const node = this.textEl[data.index] as Text;
    const option = this.option.getText(data.id);

    if (!node || !option) {
      return;
    }

    let templateStyle;
    if (typeof styleItem?.text === "function") {
      templateStyle = styleItem.text(data.index, data.id);
    } else {
      templateStyle = styleItem?.text;
    }

    const mixedStyle = this.style.mixStyle(
      data.style,
      templateStyle,
      option.style
    );

    this.updateDrawText({
      text: data.text,
      width: data.width,
      style: mixedStyle,
      textAlign: data.textAlign,
      node,
      index: data.index,
    });

    this.option.setItem(`text-${data.id}`, { text: data.text });
  }

  async updateIcon(data: TextControlOption & { name: string }) {
    const styleItem = this.style.getStyleItem(this._style);

    const node = this.iconGroupsEl[data.index] as G;
    const option = this.option.getIcon(data.id);

    console.log(node, option);

    if (!node || !option) {
      return;
    }

    console.log("updateIcon", data, option);


    let templateStyle;
    if (typeof styleItem?.icon === "function") {
      templateStyle = styleItem.icon(data.index, data.id);
    } else {
      templateStyle = styleItem?.icon;
    }

    this.option.setItem(`icon-${data.id}`, { name: data.name });

    // Todo: 临时操作，写的比较粗糙
    await this.icon.fetchIcons([data.name]);

    this.icon.updateIcon(node, data, data.name);

    this.style.applyStyle(
      node,
      this.style.mixStyle(templateStyle, option.style),
      data.index,
      data.id,
    );
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
