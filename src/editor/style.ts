import type { Element, Svg, StrokeData, FillData } from "@svgdotjs/svg.js";
// import type SmartArtData from "./data";

const styleList: ISmartArtStyle[] = [
  {
    // 模板名称
    name: "test1",
    background: {
      color: "#FEFAE0",
    },
    rect: {
      fill: {
        color: "#A4B465",
      },
      stroke: {
        color: "#626F47",
        width: 2,
      },
    },
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
      color: "#D1F8EF",
    },
    rect: {
      fill: {
        color: "#A1E3F9",
      },
      stroke: {
        color: "#3674B5",
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
];

export const styleNames = styleList.map((item) => item.name);

interface ISmartArtStyle {
  name: string;
  background?: FillData;
  rect: {
    fill?: FillData;
    stroke?: StrokeData;
  };
  icon: {
    stroke?: StrokeData;
  };
}

class SmartArtStyle {
  private draw: Svg;

  constructor(draw: Svg) {
    this.draw = draw;
  }

  setRectStyle(rectEl: Element, templateName: string) {
    const styleItem = styleList.find((item) => item.name === templateName);

    if (!styleItem) {
      return;
    }

    if (styleItem.rect) {
      styleItem.rect.fill && rectEl.fill(styleItem.rect.fill);
      styleItem.rect.stroke && rectEl.stroke(styleItem.rect.stroke);
    }
  }

  setIconStyle(iconEl: Element, templateName: string) {
    const styleItem = styleList.find((item) => item.name === templateName);

    if (!styleItem) {
      return;
    }

    if (styleItem.icon) {
      iconEl.fill("none");
      styleItem.icon.stroke && iconEl.stroke(styleItem.icon.stroke);
    }
  }

  setBackgroundStyle(bgEl: Element, templateName: string) {
    const styleItem = styleList.find((item) => item.name === templateName);

    if (!styleItem) {
      return;
    }

    if (styleItem.icon) {
      styleItem.background && bgEl.fill(styleItem.background);
    }
  }
}

export default SmartArtStyle;
