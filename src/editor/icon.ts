import type { Element, Svg } from "@svgdotjs/svg.js";

export interface ISmartArtDataItem {
  text: string;
}

export interface ISmartArtData {
  title: string;
  items: ISmartArtDataItem[];
}

class SmartArtIcon {
  private draw: Svg;

  constructor(draw: Svg) {
    this.draw = draw;
  }

  /**
   * 获取一个图标
   * @param {string} iconName
   * @returns {Promise<array>}
   */
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

  /**
   * 获取多个图标
   * @param {string[]} iconNames
   * @returns {Promise}
   */
  async fetchIcons(iconNames: string[]) {
    return Promise.all(iconNames.map((item) => this.fetchIcon(item)));
  }

  /**
   * 绘制一个图标
   */
  drawIcon(placeholder: Element) {

  }

  /**
   * 绘制图标
   * @param {string} icon
   */
  drawIcons(icon: string) {
    // Todo: 暂时是所有元素都画一个图标
    const elements = this.draw.find("[id^='ic-']");

    const iconGroup = this.draw.group();
    iconGroup.addClass("ic-group");

    elements.each((el) => {
      const elWidth = el.width() as number;
      const elHeight = el.height() as number;

      const g = iconGroup.group();
      const iconElement = g.svg(icon).first();

      // 等比缩放图标到 48 的宽度
      const scale = elWidth / (iconElement.width() as number);
      iconElement.size(elHeight, iconElement.height() as number * scale);

      // 居中对齐
      // const offsetX = (elWidth - 48) / 2;
      const offsetY = Math.floor((elHeight - (iconElement.height() as number)) / 2);
      g.translate(el.x() as number, el.y() as number + offsetY);

      el.remove();
    });
  }

  /**
   * 设置样式
   */
  setIconStyle() {

  }
}

export default SmartArtIcon;
