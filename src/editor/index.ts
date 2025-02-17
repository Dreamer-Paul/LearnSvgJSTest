import { Path, SVG, type Svg } from "@svgdotjs/svg.js";
import { debounce } from "lodash";

interface SmartArtEditorProps {
  el: string;
  template: string;
  data: SmartArtData;
  onInputPositionChange: (position: {
    width: number;
    height: number;
    x: number;
    y: number;
    text: string;
  }) => void;
}

interface SmartArtData {
  title: string;
  items: SmartArtDataItem[];
}

interface SmartArtDataItem {
  text: string;
}

class SmartArtEditor {
  // private el: string;
  private template: string;
  private data: SmartArtData = {
    title: "",
    items: [],
  };
  private draw: Svg;
  private svgPosition: { left: number; top: number };
  private onInputPositionChange: (position: {
    width: number;
    height: number;
    x: number;
    y: number;
    text: string;
  }) => void;

  constructor(props: SmartArtEditorProps) {
    // this.el = props.el;
    this.template = props.template;
    this.onInputPositionChange = props.onInputPositionChange;

    this.setData(props.data);

    this.svgPosition = { left: 0, top: 0 };

    this.draw = SVG().addTo(props.el);

    this.drawContext();

    this.bindClickEvent();

    this.init();
  }

  // 初始化
  init() {
    console.log("init", this.draw, this.svgPosition);
    this.gegSvgPosition();

    window.addEventListener(
      "scroll",
      debounce(() => {
        console.log("scroll", this.draw.node.getBoundingClientRect());

        this.gegSvgPosition();
      }, 300)
    );
  }

  // 获取 svg 位置
  gegSvgPosition() {
    const rect = this.draw.node.getBoundingClientRect();
    this.svgPosition = {
      left: rect.left,
      top: rect.top,
    };
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
        const target = ev.target;
        const rect = target.getBoundingClientRect();
        console.log("rect", rect, this.svgPosition);

        this.onInputPositionChange({
          width: rect.width,
          height: rect.height,
          x: rect.left - (this.svgPosition.left || 0),
          y: rect.top - (this.svgPosition.top || 0),
          text: target.getAttribute("data-text") || "",
        });

        return;
      }

      this.onInputPositionChange({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        text: "",
      });

      const index = parseInt(id.split("-").pop() || "0", 10);

      // id 示例：bt-cc-add-1，意味着我需要插入一个节点到索引为 1 的位置（0 后面插一个）
      if (id.includes("add")) {
        this.addItem(index); // 添加项目
        // this.draw.clear(); // 清空画布
        // await this.getTemplate(this.template); // 替换模板
        this.drawContext(); // 重新绘制内容
      }
      // id 示例：bt-cc-remove-2 意味着我需要删除索引为 1 的元素
      else if (id.includes("remove")) {
        this.removeItem(index); // 删除项目

        // console.log(index, this.data.items);
        // this.draw.clear(); // 清空画布
        // await this.getTemplate(this.template); // 替换模板
        this.drawContext(); // 重新绘制内容
      }
    });
  }

  /**
   * 设置需要展示的数据
   * @param {object} nextData
   */
  setData(nextData: SmartArtData) {
    this.data = nextData;
  }

  /**
   * 获取当前内容数量
   */
  get count() {
    return this.data.items.length;
  }

  async getTemplate(templateName: string) {
    // 获取 SVG 文件内容
    const response = await fetch(`/${templateName}--family--${this.count}.svg`);
    const svgText = await response.text();

    // 解析 SVG 文件内容并添加到画布中
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    const width = Number(svgElement.getAttribute("width") || 0);
    const height = Number(svgElement.getAttribute("height") || 0);

    return [svgElement.outerHTML, width, height];
  }

  async drawContext() {
    this.draw.rect("100%", "100%").fill("beige");

    const [str, width, height] = await this.getTemplate(this.template);

    this.draw.clear();
    this.draw
      .svg(str as string)
      .x(0)
      .y(0);

    this.draw.size(width, height);

    this.fillItemText();
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

  /**
   * 填入文本到 Svg 图
   */
  fillItemText() {
    const elements = this.draw.find("[id^='tx-']");

    elements.each((el, index) => {
      const element = el as Path;
      element.attr({ "data-text": this.data.items[index].text || "" });

      const id = element.id();
      // Todo 这里插入的顺序会反，怎么办
      console.log("id", id);

      this.draw.text((add) => {
        let content = "";

        if (id.includes("title")) {
          content = "标题（假的）";
        } else {
          content = this.data.items[index].text;
        }

        const lines = this.wrapText(content, element.width() as number);

        lines.forEach((line) => {
          const tspan = add.tspan(line.text).newLine();

          // 设置文本对齐方式
          if (id.includes("lt") || id.includes("lc") || id.includes("lb")) {
            tspan.dx(0); // 左对齐
          } else if (id.includes("rt") || id.includes("rc") || id.includes("rb")) {
            tspan.dx(element.width() as number - line.width); // 右对齐
          } else {
            tspan.dx((element.width() as number - line.width) / 2); // 居中对齐
          }
        });

        add.font({
          size: 24,
        });
        add.translate(element.x() as number, element.y() as number + 24);
      });

      console.log(this.data.items[index].text);
    });
  }

  addItem(index: number) {
    this.data.items.splice(index - 1, 0, { text: "" }); // 在指定索引后插入一个新项目
  }

  removeItem(index: number) {
    this.data.items.splice(index - 1, 1); // 删除指定索引的项目
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
