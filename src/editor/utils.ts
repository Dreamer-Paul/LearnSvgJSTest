import type { Dom, Element } from "@svgdotjs/svg.js";

const getParentPosition = (element: Dom | undefined | null): { x: number; y: number } => {
  if (!element) return { x: 0, y: 0 };

  const parentPos = element.attr("data-position") as string | null;
  if (parentPos) {
    const [px, py] = parentPos.split(";").map((item) => parseInt(item.split(":")[1]));
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
export const getXY = (el: Element) => {
  // 竞品的私有属性
  const position = el.attr("data-position") as string;

  if (position) {
    const [x, y, width, height] = position.split(";").map((item) => parseInt(item.split(":")[1]));
    const parentPosition = getParentPosition(el.parent());

    console.log("getXY", el.id(), width, height);

    return { x: x + parentPosition.x, y: y + parentPosition.y, width, height };
  }

  const matrix = el.matrix();

  return {
    x: el.x() as number || matrix.e,
    // 如果元素旋转了 180 度，还需要 - el.height()
    y: el.y() as number || matrix.f,
  };
};

// 获取元素相对于画布的标准位置
export const getBoundingClientRect = (el: Element): { x: number; y: number; width: number; height: number } => {
  const position = el.attr("data-position") as string;

  const rect = el.node.getBoundingClientRect();
  const svg = el.root().node as SVGSVGElement;
  const svgRect = svg.getBoundingClientRect();

  if (position) {
    const [x, y, width, height] = position.split(";").map((item) => parseInt(item.split(":")[1]));
    // const parentPosition = getParentPosition(el.parent());

    // console.log("getXY", el.id(), width, height);

    // return { x: x + parentPosition.x, y: y + parentPosition.y, width, height };

    return {
      x: rect.left - svgRect.left,
      y: rect.top - svgRect.top,
      width,
      height,
    }
  }



  return {
    x: rect.left - svgRect.left,
    y: rect.top - svgRect.top,
    width: rect.width,
    height: rect.height,
  };
};
