import type { Element } from "@svgdotjs/svg.js";

// 采用两种方式获取坐标
export const getXY = (el: Element) => {
  const matrix = el.matrix();

  return {
    x: el.x() as number || matrix.e,
    // 如果元素旋转了 180 度，还需要 - el.height()
    y: el.y() as number || matrix.f,
  };
}
