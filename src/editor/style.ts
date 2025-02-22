import type { Element, Svg, StrokeData, FillData } from "@svgdotjs/svg.js";

// 预设的颜色组合，更换模版可取这里的颜色做风格化
const presetColors = ["#d70505", "#ffa700", "#48ce07", "#02d09e", "#028dd0"];

// 风格预设
const styleList: ISmartArtStyle[] = [
  {
    // 模板名称
    name: "test1",
    background: {
      color: "#FEFAE0",
    },
    rectMode: "colors",
    rect: (index: number) => {
      return {
        fill: {
          color: presetColors[index],
        },
        stroke: {
          color: "#626F47",
          width: 2,
        },
      };
    },
    // rect: {
    //   fill: {
    //     color: "#A4B465",
    //   },
    //   stroke: {
    //     color: "#626F47",
    //     width: 2,
    //   },
    // },
    icon: {
      stroke: {
        color: "#FEFAE0",
        width: 2,
      },
    },
  },
  {
    name: "test2",
    background: {
      color: "#FBFFE4",
    },
    rect: {
      fill: {
        color: "#B3D8A8",
      },
      stroke: {
        color: "#3D8D7A",
        width: 2,
      },
    },
    icon: {
      stroke: {
        color: "#fff",
        width: 2,
      },
    },
  },
  {
    name: "test3",
    background: {
      color: "#FFEDFA",
    },
    rect: {
      fill: {
        color: "#fff",
      },
      stroke: {
        color: "#A1E3F9",
        width: 2,
      },
    },
    icon: {
      stroke: {
        color: "#3674B5",
        width: 2,
      },
    },
  },
  {
    name: "test4",
    background: {
      color: "#F2EFE7",
    },
    rect: {
      fill: {
        color: "#4C7B8B",
      },
      stroke: {
        color: "#23486A",
        width: 2,
      },
    },
    icon: {
      stroke: {
        color: "#EFB036",
        width: 2,
      },
    },
  },
];

export const styleNames = styleList.map((item) => item.name);

interface IRectStyle {
  fill?: FillData;
  stroke?: StrokeData;
}

interface ISmartArtStyle {
  name: string;
  background?: FillData;
  rectMode?: "colors";
  rect: IRectStyle | ((index: number) => IRectStyle);
  icon: {
    stroke?: StrokeData;
  };
}

class SmartArtStyle {
  private draw: Svg;

  constructor(draw: Svg) {
    this.draw = draw;
  }

  getStyleItem(styleName: string) {
    return styleList.find((item) => item.name === styleName);
  }

  setRectStyle(rectEl: Element, style: ISmartArtStyle, index?: number) {
    let rectStyle: IRectStyle;

    if (typeof style.rect === "function") {
      rectStyle = style.rect(index || 0);
    } else {
      rectStyle = style.rect;
    }

    rectStyle.fill && rectEl.fill(rectStyle.fill);
    rectStyle.stroke && rectEl.stroke(rectStyle.stroke);
  }

  setIconStyle(iconEl: Element, style: ISmartArtStyle, index?: number) {
    iconEl.fill("none");
    style.icon.stroke && iconEl.stroke(style.icon.stroke);
  }

  setBackgroundStyle(bgEl: Element, templateName: string) {
    const styleItem = styleList.find((item) => item.name === templateName);

    if (!styleItem) {
      return;
    }

    if (styleItem.background) {
      bgEl.fill(styleItem.background);
    }
  }
}

export default SmartArtStyle;
