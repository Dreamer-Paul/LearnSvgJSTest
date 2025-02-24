import type { Element } from "@svgdotjs/svg.js";

// 采用两种方式获取坐标
export const getXY = (el: Element) => {
  const matrix = el.matrix();

  return {
    x: el.x() as number || matrix.e,
    y: el.y() as number || matrix.f,
  };
}
