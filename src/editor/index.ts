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
    // svgElement.getAttribute("height");

    // this.draw.svg(svgElement.outerHTML);

    return [svgElement.outerHTML, width, height];
  }

  async drawContext() {
    this.draw.rect("100%", "100%").fill("skyblue");

    const [str, width, height] = await this.getTemplate(this.template);

    this.draw
      .svg(str as string)
      .x(0)
      .y(100);

    this.draw.size(width, height);

    this.fillItemText();
  }

  /**
   * 填入文本到 Svg 图
   */
  fillItemText() {
    let index = 1;

    while (index <= this.count) {
      const pathElement = this.draw.findOne(`#tx-lc-${index}`) as Path;
      const pathElementRight = this.draw.findOne(`#tx-rc-${index}`) as Path;

      const el = pathElement || pathElementRight;

      if (el) {
        const matrix = el.transform();
        const bbox = el.bbox();
        // const transformedX = matrix.translateX;
        // const transformedY = matrix.translateY - Math.round(bbox.height / 2);

        console.log(bbox.height, matrix, el.x(), el.y());

        // 创建一个外部 div 元素
        const foreignObject = this.draw
          .foreignObject(bbox.width, 24 * 1.5)
          // .move(transformedX, transformedY)
          // .cy(transformedY)
          // .translate(transformedX, transformedY);
          .translate(el.x(), el.y());
        foreignObject.add(
          `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 24px; color: red;">重叠富文本 ${index}</div>`
        );
      }

      index++;
    }
  }

  addItem(index: number) {
    this.data.items.push({
      text: "",
    });

    this.drawContext();
  }

  removeItem(index: number) {
    this.data.items.splice(index, 1);

    this.drawContext();
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
