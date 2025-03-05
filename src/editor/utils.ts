import type { Element } from "@svgdotjs/svg.js";
import type { TextControlOption } from ".";

// 采用两种方式获取坐标
export const getTextPosition = (el: Element) => {
  const bbox = el.bbox();
  const ctm = el.ctm();

  // 有一层包裹
  if (el.node.tagName === "g") {
    const childPath = el.findOne("path") as Element | null;

    // 直接用子的
    if (childPath) {
      const childCtm = childPath.ctm();

      // 这里有没有可能用 bbox 呢，暂时不清楚哦
      return {
        x: childCtm.e,
        y: childCtm.f,
        width: bbox.width,
        height: bbox.height,
      };
    }

    // 回退到父
    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    }
  }

  // 没有包裹
  if (el.node.tagName === "path") {
    // 有变换，直接用 ctm
    if (el.attr("transform")) {
      return {
        x: ctm.e,
        y: ctm.f,
        width: bbox.width,
        height: bbox.height,
      }
    }

    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    }
  }

  // 待定，异常情况
  return {
    x: 200,
    y: 200,
    width: bbox.width,
    height: bbox.height,
  };
};

// 获取元素相对于画布的标准位置
export const getBoundingClientRect = (
  el: Element
): { x: number; y: number; width: number; height: number } => {
  const position = el.attr("data-position") as string;
  const transform = el.attr("transform") as string;

  const rect = el.node.getBoundingClientRect();
  const svg = el.root().node as SVGSVGElement;
  const svgRect = svg.getBoundingClientRect();

  if (position) {
    const [x, y, width, height] = position
      .split(";")
      .map((item) => parseInt(item.split(":")[1]));

    return {
      x: rect.left - svgRect.left,
      y: rect.top - svgRect.top,
      width,
      height,
    };
  }
  console.log("x", el.x(), "y", el.y(), "rect", rect);

  if (transform) {
    const matrix = el.matrix();
    const x = matrix.e;
    const y = matrix.f;
    // console.log("transform", transform, el.id(), matrix);

    return {
      x,
      y,
      width: rect.width,
      height: rect.height,
    };
  }

  console.log("fuck", el.id());

  return {
    x: 0,
    y: 0,
    // x: rect.left - svgRect.left,
    // y: rect.top - svgRect.top,
    // x: el.x(),
    // y: el.y(),
    width: rect.width,
    height: rect.height,
  };
};

export const getAlign = (alignStr: string): [TextControlOption["textAlign"], TextControlOption["verticalAlign"]] => {
  const horizontalAlignMap: Record<string, TextControlOption["textAlign"]> = {
    l: "left",
    r: "right",
    c: "center",
  };

  const verticalAlignMap: Record<string, TextControlOption["verticalAlign"]> = {
    t: "top",
    b: "bottom",
    c: "center",
  };

  const [hAlign, vAlign] = alignStr.split("");

  const textAlign = horizontalAlignMap[hAlign] || "left";
  const verticalAlign = verticalAlignMap[vAlign] || "center";

  return [textAlign, verticalAlign];
};
