import type {
  Element,
  Svg,
  StrokeData,
  FillData,
  FontData,
} from "@svgdotjs/svg.js";

// 预设的颜色组合，更换模版可取这里的颜色做风格化
const presetColors = ["#d70505", "#ffa700", "#48ce07", "#02d09e", "#028dd0"];

const presetColors2 = [
  "#64B5F6",
  "#FFD95C",
  "#F06292",
  "#4DD0E1",
  "#9575CD",
  "#FF8A65",
  "#AED581",
  "#DCE775",
];

// 风格预设
const styleList: ISmartArtStyle[] = [
  {
    // 模板名称
    name: "test1",
    background: {
      color: "#FEFAE0",
    },
    shape: {
      fill: {
        color: "#888",
      },
    },
    pattern: (index: number) => {
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
    icon: {
      stroke: {
        color: "#FEFAE0",
        width: 2,
      },
    },
  },
  {
    // 模板名称
    name: "Colors1",
    background: {
      color: "#fff",
    },
    shape: {
      fill: {
        color: "#bbb",
      },
    },
    pattern: (index: number) => {
      return {
        fill: {
          color: presetColors2[index],
        },
      };
    },
    icon: {
      stroke: {
        color: "#fff",
        width: 2,
      },
    },
    text: {
      fill: {
        color: "#30394A",
      },
    },
  },
  {
    name: "test2",
    background: {
      color: "#FBFFE4",
    },
    shape: {
      fill: {
        color: "#888",
      },
    },
    pattern: {
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
      color: "#FFF2F2",
    },
    shape: {
      fill: {
        color: "#888",
      },
    },
    pattern: {
      fill: {
        color: "#7886C7",
      },
      stroke: {
        color: "#A9B5DF",
        width: 4,
        linejoin: "round",
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
    name: "test4",
    background: {
      color: "#F2EFE7",
    },
    shape: {
      fill: {
        color: "#888",
      },
    },
    pattern: {
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

export interface IStyle {
  fill?: FillData;
  stroke?: StrokeData;
  font?: FontData;
}

export type IStyleFn = IStyle | ((index: number) => IStyle);

interface ISmartArtStyle {
  name: string;
  background?: FillData;
  shape: IStyleFn;
  pattern: IStyleFn;
  icon: IStyleFn;
  text?: IStyleFn;
}

class SmartArtStyle {
  private draw: Svg;

  constructor(draw: Svg) {
    this.draw = draw;
  }

  getStyleItem(styleName: string) {
    return styleList.find((item) => item.name === styleName);
  }

  /**
   * 应用样式
   * @param el 元素
   * @param style 样式
   * @param index 索引
   */
  applyStyle(el: Element, style: IStyleFn, index: number) {
    let _style: IStyle;

    if (typeof style === "function") {
      _style = style(index || 0);
    } else {
      _style = style;
    }

    if (_style.fill) {
      el.fill(_style.fill);
    } else {
      el.fill("none");
    }

    if (_style.stroke) {
      el.stroke(_style.stroke);
    } else {
      el.stroke({ color: "none" });
    }
  }

  /**
   * 合并多个样式
   * @param styles
   * @returns {IStyle}
   */
  mixStyle(...styles: (IStyle | undefined)[]): IStyle {
    const res: IStyle = {
      stroke: {},
      fill: {},
      font: {},
    };

    styles.forEach((style) => {
      if (style) {
        if (style.stroke) {
          res.stroke = { ...res.stroke, ...style.stroke };
        }
        if (style.fill) {
          res.fill = { ...res.fill, ...style.fill };
        }
        if (style.font) {
          res.font = { ...res.font, ...style.font };
        }
      }
    });

    if (res.stroke && Object.keys(res.stroke).length === 0) {
      delete res.stroke;
    }

    if (res.fill && Object.keys(res.fill).length === 0) {
      delete res.fill;
    }

    if (res.font && Object.keys(res.font).length === 0) {
      delete res.font;
    }

    return res;
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
