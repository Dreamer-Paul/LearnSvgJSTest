import { type Svg } from "@svgdotjs/svg.js";

export interface ISmartArtDataItem {
  text: string;
}

export interface ISmartArtData {
  title: string;
  items: ISmartArtDataItem[];
}

export type ISmartArtMap = Record<string, string>;

class SmartArtText {
  private draw: Svg;

  constructor(draw: Svg) {
    this.draw = draw;
  }

  wrapText(
    text: string,
    width: number,
    style?: { size?: number; [key: string]: any }
  ) {
    const draw = this.draw;
    const lines: { text: string; width: number; height: number }[] = [];
    const paragraphs = text.split("\n");
    const size = style?.size || 18;

    // 创建临时文本元素来测量宽度
    const tempText = draw.text("").font({
      size,
      ...style,
    });

    paragraphs.forEach((paragraph) => {
      const words = paragraph.split("");
      let currentLine = "";
      let currentLineWidth = 0;

      words.forEach((word) => {
        tempText.text(currentLine + word);

        if (tempText.length() >= width) {
          lines.push({
            text: currentLine,
            width: currentLineWidth,
            height: size,
          });
          currentLine = word;
          currentLineWidth = tempText.length();
        } else {
          currentLine += word;
          currentLineWidth = tempText.length();
        }
      });

      if (currentLine) {
        lines.push({
          text: currentLine,
          width: currentLineWidth,
          height: size,
        });
      }
    });

    tempText.remove();
    return lines;
  }
}

export default SmartArtText;
