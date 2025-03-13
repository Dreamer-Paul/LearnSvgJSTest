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
    };
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
      };
    }

    return {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    };
  }

  // 待定，异常情况
  return {
    x: 200,
    y: 200,
    width: bbox.width,
    height: bbox.height,
  };
};

export const getIconPosition = (el: Element) => {
  const bbox = el.bbox();

  if (el.attr("transform")) {
    const ctm = el.ctm();

    return {
      x: ctm.e,
      y: ctm.f,
      height: bbox.height,
      width: bbox.width,
    };
  }

  return {
    x: bbox.x,
    y: bbox.y,
    height: bbox.height,
    width: bbox.width,
  };
};

// 获取元素相对于画布的标准位置
export const getBoundingClientRect = (
  el: Element
): { x: number; y: number; width: number; height: number } => {
  const bbox = el.bbox();
  const ctm = el.ctm();

  // 单独处理 rect 对象
  if (el.node.tagName === "rect") {
    return {
      x: (el.x() as number) + ctm.e,
      y: (el.y() as number) + ctm.f,
      height: bbox.height,
      width: bbox.width,
    };
  }

  console.log("others", el.node.tagName);

  // path 或者 g 对象
  return {
    // x: ctm.e + bbox.x,
    // y: ctm.f + bbox.y,
    x: ctm.e,
    y: ctm.f,
    // x: bbox.x,
    // y: bbox.y,
    height: bbox.height,
    width: bbox.width,
  };
};

export const getAlign = (
  alignStr: string
): [TextControlOption["textAlign"], TextControlOption["verticalAlign"]] => {
  const horizontalAlignMap: Record<string, TextControlOption["textAlign"]> = {
    l: "left",
    r: "right",
    c: "center",
  };

  const verticalAlignMap: Record<string, TextControlOption["verticalAlign"]> = {
    t: "top",
    b: "bottom",
    c: "middle",
    m: "middle",
  };

  const [hAlign, vAlign] = alignStr.split("");

  const textAlign = horizontalAlignMap[hAlign] || "left";
  const verticalAlign = verticalAlignMap[vAlign] || "middle";

  return [textAlign, verticalAlign];
};

export const clearStyle = (el: Element, excludeAttr = ["id", "transform"]) => {
  const attributes = el.node.attributes;

  for (let i = attributes.length - 1; i >= 0; i--) {
    const attrName = attributes[i].name;

    if (!excludeAttr.includes(attrName)) {
      el.node.removeAttribute(attrName);
    }
  }
};
