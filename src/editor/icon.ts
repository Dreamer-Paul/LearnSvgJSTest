import { G, type Element, type Svg } from "@svgdotjs/svg.js";
import type SmartArtData from "./data";

export interface ISmartArtDataItem {
  text: string;
}

export interface ISmartArtData {
  title: string;
  items: ISmartArtDataItem[];
}

export type ISmartArtMap = Record<string, string>;

class SmartArtIcon {
  private draw: Svg;
  private map: ISmartArtMap = {};

  constructor(draw: Svg) {
    this.draw = draw;
  }

  addToMap(key: string, value: string) {
    this.map[key] = value;
  }

  /**
   * 获取一个图标
   * @param {string} iconName
   * @returns {Promise<array>}
   */
  async fetchIcon(iconName: string) {
    // social-photobucket--logos--24x24.svg
    const response = await fetch(`/icons/${iconName}.svg`);

    const svgText = await response.text();

    // 解析 SVG 文件内容并添加到画布中
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // 提取所有 path 标签中的 d 属性
    const paths = svgElement.querySelectorAll("path");
    let combinedPathData = "";
    paths.forEach((path) => {
      combinedPathData += path.getAttribute("d") + " ";
    });

    // 创建一个新的 SVG 元素，包含合并后的 path
    const combinedSvg = `<path d="${combinedPathData.trim()}" />`;

    return combinedSvg;
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
  drawIcon(placeholder: Element) {}

  /**
   * 绘制图标
   * @param icon
   */
  drawIcons(data: SmartArtData) {
    const elements = this.draw.find("[id^='ic-']");

    const iconGroup = this.draw.group();
    iconGroup.addClass("ic-group");

    const groups: G[] = [];

    elements.each((el) => {
      const id = el.id();
      const index = parseInt(id.split("-").pop() || "0", 10) - 1;

      if (Number.isNaN(index)) {
        return;
      }

      const iconName = data.getItemIcon(index);

      if (!iconName) {
        return;
      }

      const icon = this.map[iconName];

      const elWidth = el.width() as number;
      const elHeight = el.height() as number;

      const g = iconGroup.group();
      const iconElement = g.svg(icon).first();

      // 等比缩放图标到 48 的宽度
      const scale = elWidth / (iconElement.width() as number);
      iconElement.size(elWidth, (iconElement.height() as number) * scale);

      console.log((iconElement.height() as number) * scale);

      // 居中对齐
      const offsetY = (elHeight - (iconElement.height() as number)) / 2;

      g.translate(el.x() as number, (el.y() as number) + offsetY);

      groups.push(g);

      el.remove();
    });

    return groups;
  }

  /**
   * 设置样式
   */
  setIconStyle() {}
}

export default SmartArtIcon;
