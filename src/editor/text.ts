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

  wrapText(text: string, size: number, width: number) {
    const draw = this.draw;
    const lines: { text: string; width: number; height: number }[] = [];
    const paragraphs = text.split("\n");

    // 创建临时文本元素来测量宽度
    const tempText = draw.text("").font({
      // family: 'Arial',
      size,
    });

    paragraphs.forEach((paragraph) => {
      const words = paragraph.split("");
      let currentLine = "";
      let currentLineWidth = 0;
      let firstWordWidth = 0;

      words.forEach((word, index) => {
        tempText.text(currentLine + word);

        if (index === 0) {
          firstWordWidth = tempText.length();
        }

        console.log("tempText", tempText, tempText.length(), width);

        if (width - tempText.length() < firstWordWidth) {
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
