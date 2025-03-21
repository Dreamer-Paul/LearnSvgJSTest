import { G, type Svg } from "@svgdotjs/svg.js";
import type { TextControlOption } from ".";

export interface ISmartArtDataItem {
  text: string;
}

export interface ISmartArtData {
  title: string;
  items: ISmartArtDataItem[];
}

export type ISmartArtMap = Record<string, string>;

const baseUrl = import.meta.env.APP_ICON_S3_BASEURL;

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
   * @returns {Promise<string>}
   */
  async fetchIcon(iconName: string) {
    const response = await fetch(`${baseUrl}/${iconName}-line.svg`);

    const svgText = await response.text();

    // 解析 SVG 文件内容并添加到画布中
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // 识别异常
    if (!svgElement || svgElement.tagName !== "svg") {
      return;
    }

    // 提取所有 path 标签中的 d 属性
    const paths = svgElement.querySelectorAll("path");
    let combinedPathData = "";
    paths.forEach((path) => {
      combinedPathData += path.getAttribute("d") + " ";
    });

    // 更正部分图标的填充属性
    const fillRule = paths.item(0)?.getAttribute("fill-rule") || "nonzero";
    const clipRule = paths.item(0)?.getAttribute("clip-rule") || "nonzero";

    // 创建一个新的 SVG 元素，包含合并后的 path
    const combinedSvg = `<path d="${combinedPathData.trim()}" fill-rule="${fillRule}" clip-rule="${clipRule}" />`;

    return combinedSvg;
  }

  /**
   * 获取多个图标
   * @param {string[]} iconNames
   * @returns {Promise}
   */
  async fetchIcons(iconNames: string[]) {
    return Promise.all(iconNames.map((item) => this.fetchIcon(item))).then(
      (res) => {
        iconNames.forEach((name, index) => {
          res[index] && this.addToMap(name, res[index]);
        });
      }
    );
  }

  /**
   * 绘制一个图标
   */
  drawIcon(icon: TextControlOption, name: string) {
    const iconStr = this.map[name];

    if (!iconStr) {
      return;
    }

    const elWidth = icon.width - 4;
    const elHeight = icon.height - 4;

    // console.log("1", name, elWidth, elHeight);

    const g = this.draw.group();
    g.id(`icon-${name}`);
    const iconElement = g.svg(iconStr).first();

    // 获取图标的原始宽度和高度
    const originalWidth = iconElement.width() as number;
    const originalHeight = iconElement.height() as number;

    // 计算宽度和高度的缩放比例
    const widthScale = elWidth / originalWidth;
    const heightScale = elHeight / originalHeight;

    // 选择较小的缩放比例以保持图标的宽高比
    const scale = Math.min(widthScale, heightScale);

    // 按比例缩放图标
    iconElement.size(originalWidth * scale, originalHeight * scale);

    // console.log("2 iconElement", iconElement.width(), iconElement.height());

    // 居中对齐
    const offsetX = (elWidth - (iconElement.width() as number)) / 2;
    const offsetY = (elHeight - (iconElement.height() as number)) / 2;

    g.translate(icon.x + offsetX, icon.y + offsetY);

    return g;
  }

  updateIcon(node: G, icon: TextControlOption, name: string) {
    const iconStr = this.map[name];

    if (!iconStr) {
      return;
    }

    const elWidth = icon.width - 4;
    const elHeight = icon.height - 4;

    node.id(`icon-${name}`);

    // 查找现有的 path 元素
    const existingPath = node.findOne("path");
    if (existingPath) {
      // 移除现有的 path 元素
      existingPath.remove();
    }

    // 添加新的 path 元素
    const iconElement = node.svg(iconStr).first();

    // 获取图标的原始宽度和高度
    const originalWidth = iconElement.width() as number;
    const originalHeight = iconElement.height() as number;

    // 计算宽度和高度的缩放比例
    const widthScale = elWidth / originalWidth;
    const heightScale = elHeight / originalHeight;

    // 选择较小的缩放比例以保持图标的宽高比
    const scale = Math.min(widthScale, heightScale);

    // 按比例缩放图标
    iconElement.size(originalWidth * scale, originalHeight * scale);

    // 居中对齐
    const offsetX = (elWidth - (iconElement.width() as number)) / 2;
    const offsetY = (elHeight - (iconElement.height() as number)) / 2;

    node.transform({
      translateX: icon.x + offsetX,
      translateY: icon.y + offsetY,
    });

    return node;
  }

  /**
   * 设置样式
   */
  setIconStyle() {}
}

export default SmartArtIcon;
