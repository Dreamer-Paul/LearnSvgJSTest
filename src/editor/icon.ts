import { G, type Element, type Svg } from "@svgdotjs/svg.js";
import { getXY } from "./utils";
import type SmartArtOption from "./option";
import type { TextControlOption } from ".";

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

  map: ISmartArtMap = {};

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
  drawIcon(icon: TextControlOption, name: string) {
    const iconStr = this.map[name];

    const elWidth = icon.width;
    const elHeight = icon.height;

    const g = this.draw.group();
    const iconElement = g.svg(iconStr).first();

    // 等比缩放图标到 48 的宽度
    const scale = elWidth / (iconElement.width() as number);
    iconElement.size(elWidth, (iconElement.height() as number) * scale);

    // 居中对齐
    const offsetY = (elHeight - (iconElement.height() as number)) / 2;

    g.translate(icon.x, icon.y + offsetY);

    return g;
  }

  /**
   * 设置样式
   */
  setIconStyle() {}
}

export default SmartArtIcon;
