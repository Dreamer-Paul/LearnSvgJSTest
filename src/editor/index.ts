import { Path, SVG, type Svg } from "@svgdotjs/svg.js";

interface SmartArtEditorProps {
  el: string;
  template: string;
  data: SmartArtData;
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

  constructor(props: SmartArtEditorProps) {
    // this.el = props.el;
    this.template = props.template;
    this.setData(props.data);

    this.draw = SVG().addTo(props.el);

    this.drawContext();

    this.bindClickEvent();
  }

  bindClickEvent() {
    this.draw.on("click", async (ev) => {
      console.log(ev.target);

      if (!(ev.target instanceof Element)) {
        return;
      }

      const { id } = ev.target;
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
      .y(100);

    this.draw.size(width, height);

    this.fillItemText();
  }

  wrapText(text: string, width: number) {
    const draw = this.draw;
    const words = text.split("");
    const lines = [];
    let currentLine = "";

    // 创建临时文本元素来测量宽度
    const tempText = draw.text("").font({
      // family: 'Arial',
      size: 24,
    });

    words.forEach((word) => {
      tempText.text(currentLine + word);

      if (tempText.length() > width) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine += word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    tempText.remove();
    return lines;
  }

  /**
   * 填入文本到 Svg 图
   */
  fillItemText() {
    let index = 0;

    while (index <= this.count) {
      const pathElement = this.draw.findOne(`#tx-lc-${index + 1}`) as Path;
      const pathElementRight = this.draw.findOne(`#tx-rc-${index + 1}`) as Path;

      const el = pathElement || pathElementRight;

      if (el) {
        const matrix = el.transform();
        const bbox = el.bbox();
        // const transformedX = matrix.translateX;
        // const transformedY = matrix.translateY - Math.round(bbox.height / 2);

        // console.log(bbox.height, matrix, el.x(), el.y());

        this.draw.text((add) => {
          const content = this.data.items[index].text;
          // console.log(el.width());
          const lines = this.wrapText(content, el.width());

          lines.forEach((line, index) => {
            // console.log("f", add.width());
            // add.x(add.x() + add.width());

            const tspan = add.tspan(line).newLine();

            // tspan.x(tspan.x() + tspan.width());

            console.log("length", tspan.length());
          });

          // add.tspan();
          add.font({
            size: 24,
          });
          add.translate(el.x(), el.y() + 24);
        });

        console.log(this.data.items[index].text);

        // 创建一个外部 div 元素
        // const foreignObject = this.draw
        //   .foreignObject(bbox.width, 24 * 1.5)
        //   // .move(transformedX, transformedY)
        //   // .cy(transformedY)
        //   // .translate(transformedX, transformedY);
        //   .translate(el.x(), el.y());
        // foreignObject.add(
        //   `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 24px; color: red;">重叠富文本 ${index}</div>`
        // );
      }

      index++;
    }
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
