import type { Dom, Element, Rect } from "@svgdotjs/svg.js";
import type { TextControlOption } from ".";

const getParentPosition = (
  element: Dom | undefined | null
): { x: number; y: number } => {
  if (!element) return { x: 0, y: 0 };

  const parentPos = element.attr("data-position") as string | null;
  if (parentPos) {
    const [px, py] = parentPos
      .split(";")
      .map((item) => parseInt(item.split(":")[1]));
    const parentElement = element.parent();
    const parentPosition = getParentPosition(parentElement);

    // 顶层，无视掉
    if (parentElement?.id().includes("family")) {
      return { x: px, y: py };
    }

    return { x: px + parentPosition.x, y: py + parentPosition.y };
    // return { x: px, y: py };
  }

  return { x: 0, y: 0 };
};

// 采用两种方式获取坐标
export const getTextPosition = (el: Element) => {
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
    x: rect.left - svgRect.left,
    y: rect.top - svgRect.top,
    width: rect.width,
    height: rect.height,
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
