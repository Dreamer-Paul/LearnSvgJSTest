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
}

export default SmartArtText;
