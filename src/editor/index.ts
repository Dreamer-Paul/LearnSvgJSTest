import { Path, SVG, Text, type Svg } from "@svgdotjs/svg.js";
import SmartArtData, { type ISmartArtData } from "./data";
import SmartArtIcon from "./icon";

interface SmartArtEditorProps {
  el: string;
  template: string;
  data: ISmartArtData;
  onInputPositionChange: (position: {
    className: string;
    width: number;
    height: number;
    x: number;
    y: number;
    text: string;
    textAlign: string;
  }) => void;
  onUpdateText: (fn: any) => void;
}

class SmartArtEditor {
  private template: string;
  private data: SmartArtData;
  private draw: Svg;
  private icon: SmartArtIcon;
  private onInputPositionChange: (position: {
    width: number;
    height: number;
    x: number;
    y: number;
    text: string;
    className: string;
    textAlign: string;
  }) => void;
  private onUpdateText: (fn: any) => void;

  private currentEditor:
    | {
        id: string;
        index: string | number | undefined;
      }
    | undefined;

  constructor(props: SmartArtEditorProps) {
    // this.el = props.el;
    this.template = props.template;
    this.onInputPositionChange = props.onInputPositionChange;
    this.onUpdateText = props.onUpdateText;

    this.draw = SVG().addTo(props.el);

    this.data = new SmartArtData(props.data);
    this.icon = new SmartArtIcon(this.draw);

    this.drawContext();

    this.bindClickEvent();

    this.init();
  }

  // 初始化
  init() {
    console.log("init", this.draw);

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("svg") &&
        target.tagName !== "INPUT" &&
        target.tagName !== "TEXTAREA"
      ) {
        this.onUpdateText(
          (textClassName: string, text: string, width: number) => {
            console.log("text", text, textClassName);
            this.updateText(`.${textClassName}`, text, width);
          }
        );

        this.onInputPositionChange({
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          text: "",
          className: "",
          textAlign: "",
        });
      }
    });
  }

  bindClickEvent() {
    this.draw.on("click", async (ev) => {
      console.log(ev.target);

      if (!(ev.target instanceof Element)) {
        return;
      }

      const { id } = ev.target;

      // 文本元素
      if (id.includes("tx-")) {
        this.currentEditor = {
          id,
          index: id.split("-").pop(),
        };

        // 临时修复 index 的问题
        if (!Number.isNaN(Number(this.currentEditor.index))) {
          this.currentEditor.index = Number(this.currentEditor.index);
        }

        const target = ev.target;
        const rect = target.getBoundingClientRect();
        const svgRect = this.draw.node.getBoundingClientRect();

        const textAlign =
          id.includes("lt") || id.includes("lc") || id.includes("lb")
            ? "left"
            : id.includes("rt") || id.includes("rc") || id.includes("rb")
            ? "right"
            : id.includes("ct") || id.includes("cc") || id.includes("cb")
            ? "center"
            : "left";

        this.onInputPositionChange({
          width: rect.width,
          height: rect.height,
          x: rect.left - (svgRect.left || 0),
          y: rect.top - (svgRect.top || 0),
          text:
            typeof this.currentEditor.index === "number"
              ? this.data.getItemText(this.currentEditor.index - 1)
              : this.data.getTitleText(),
          className: id + "-text",
          textAlign,
        });

        return;
      }

      this.onUpdateText(
        (textClassName: string, text: string, width: number) => {
          console.log("text", text, textClassName);
          this.updateText(`.${textClassName}`, text, width);
        }
      );

      this.onInputPositionChange({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        text: "",
        className: "",
        textAlign: "",
      });

      const index = parseInt(id.split("-").pop() || "0", 10);

      // id 示例：bt-cc-add-1，意味着我需要插入一个节点到索引为 1 的位置（0 后面插一个）
      if (id.includes("add")) {
        this.data.addItem(index); // 添加项目
        // this.draw.clear(); // 清空画布
        // await this.getTemplate(this.template); // 替换模板
        this.drawContext(); // 重新绘制内容
      }
      // id 示例：bt-cc-remove-2 意味着我需要删除索引为 1 的元素
      else if (id.includes("remove")) {
        this.data.removeItem(index); // 删除项目

        // console.log(index, this.data.items);
        // this.draw.clear(); // 清空画布
        // await this.getTemplate(this.template); // 替换模板
        this.drawContext(); // 重新绘制内容
      }
    });
  }

  async fetchIcon(iconName: string) {
    // social-photobucket--logos--24x24.svg
    const response = await fetch(`/icons/${iconName}`);

    const svgText = await response.text();

    // 解析 SVG 文件内容并添加到画布中
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    const width = Number(svgElement.getAttribute("width") || 0);
    const height = Number(svgElement.getAttribute("height") || 0);

    return [svgElement.children[0].outerHTML, width, height];
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

    console.log(svgElement);

    const width = Number(svgElement.getAttribute("width") || 0);
    const height = Number(svgElement.getAttribute("height") || 0);

    return [svgElement.children[0].outerHTML, width, height];
  }

  /**
   * 根据当前模板重新绘制图形到画板
   */
  async drawContext() {
    const [str, width, height] = await this.getTemplate(this.template);

    // Todo: 临时操作
    const [icon] = await this.icon.fetchIcon("social-photobucket--logos--24x24.svg");

    this.draw.clear();
    this.draw.svg(str as string);
    this.draw.size(width, height);

    // 设置渐变填充
    const gradient = this.draw.gradient('linear', (add) => {
      add.stop(0, '#ff0000');
      add.stop(1, '#0000ff');
    });

    const paths = this.draw.find("#lines path");

    paths.each((item) => {
      item.fill(gradient);
    });

    this.fillItemText();
    this.icon.drawIcons(icon);
  }

  wrapText(text: string, width: number) {
    const draw = this.draw;
    const words = text.split("");
    const lines = [];
    let currentLine = "";
    let currentLineWidth = 0;

    // 创建临时文本元素来测量宽度
    const tempText = draw.text("").font({
      // family: 'Arial',
      size: 24,
    });

    words.forEach((word) => {
      tempText.text(currentLine + word);

      if (tempText.length() > width) {
        lines.push({ text: currentLine, width: currentLineWidth, height: 24 });
        currentLine = word;
        currentLineWidth = tempText.length();
      } else {
        currentLine += word;
        currentLineWidth = tempText.length();
      }
    });

    if (currentLine) {
      lines.push({ text: currentLine, width: currentLineWidth, height: 24 });
    }

    tempText.remove();
    return lines;
  }

  // 绘制文字
  drawText({
    content,
    width,
    id,
    element,
    textNode,
  }: {
    content: string;
    width: number;
    id: string;
    element?: Path;
    textNode?: Text;
  }) {
    const group = this.draw.group(); // 创建一个 g 元素

    (textNode || group).text((add) => {
      const lines = this.wrapText(content, width);

      lines.forEach((line) => {
        const tspan = add.tspan(line.text).newLine();

        // 设置文本对齐方式
        if (id.includes("lt") || id.includes("lc") || id.includes("lb")) {
          tspan.dx(0); // 左对齐
        } else if (
          id.includes("rt") ||
          id.includes("rc") ||
          id.includes("rb")
        ) {
          tspan.dx(width - line.width); // 右对齐
        } else {
          tspan.dx((width - line.width) / 2); // 居中对齐
        }
      });

      if (!textNode) {
        add.addClass(`${id}-text`);
      }

      add.font({
        size: 24,
      });

      if (element) {
        add.translate(element.x() as number, (element.y() as number) + 24);
      }
    });

    if (!textNode) {
      group.addClass(`${id}-group`); // 为 g 元素添加类名
    }
  }

  /**
   * 填入文本到 Svg 图
   */
  fillItemText() {
    const elements = this.draw.find("[id^='tx-']");

    elements.each((el) => {
      const element = el as Path;
      const id = element.id();

      let content = "";

      if (id.includes("title")) {
        content = this.data.getTitleText();
      } else {
        const index = parseInt(id.split("-").pop() || "0", 10) - 1;
        content = this.data.getItemText(index);
      }

      // element.attr({ "data-text": content || "" });

      const elementWidth = element.width() as number;
      this.drawText({
        content: content,
        width: elementWidth,
        id,
        element,
      });

      // this.draw.text((add) => {
      //   const lines = this.wrapText(content, element.width() as number);

      //   lines.forEach((line) => {
      //     const tspan = add.tspan(line.text).newLine();

      //     // 设置文本对齐方式
      //     if (id.includes("lt") || id.includes("lc") || id.includes("lb")) {
      //       tspan.dx(0); // 左对齐
      //     } else if (
      //       id.includes("rt") ||
      //       id.includes("rc") ||
      //       id.includes("rb")
      //     ) {
      //       tspan.dx((element.width() as number) - line.width); // 右对齐
      //     } else {
      //       tspan.dx(((element.width() as number) - line.width) / 2); // 居中对齐
      //     }
      //   });

      //   const elId = el?.node?.id;
      //   add.addClass(`${elId}-text`);
      //   add.font({
      //     size: 24,
      //   });
      //   add.translate(element.x() as number, (element.y() as number) + 24);
      // });
    });
  }

  // 更新文本
  updateText(className: string, text: string, width: number) {
    const textNode = this.draw.findOne(className) as Text;

    if (this.currentEditor) {
      const { index } = this.currentEditor;

      if (index && typeof index === "number") {
        this.data.updateItem(index - 1, { text });
      } else {
        this.data.updateTitle(text);
      }
    }

    if (textNode) {
      this.drawText({ content: text, width, id: className, textNode });

      // textNode.text((add) => {
      //   // console.log(el.width());
      //   const lines = this.wrapText(text, width);
      //   lines.forEach((line) => {
      //     add.tspan(line.text).newLine();
      //   });
      // });
    }
  }

  exportSVG = () => {
    const svgData = this.draw.svg();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported-image.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  exportPNG = () => {
    const svgData = this.draw.svg();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob!);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exported-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };
}

export default SmartArtEditor;
