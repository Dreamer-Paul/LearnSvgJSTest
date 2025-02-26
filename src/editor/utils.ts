import type { Element } from "@svgdotjs/svg.js";

// 采用两种方式获取坐标
export const getXY = (el: Element) => {
  // 竞品的私有属性
  const position = el.attr("position") as string;

  // x:552;y:42;w:144;h:60
  if (position) {
    const [x, y, width, height] = position.split(";").map((item) => {
      return parseInt(item.split(":")[1]);
    });

    return { x, y, width, height };
  }

  const matrix = el.matrix();

  return {
    x: el.x() as number || matrix.e,
    // 如果元素旋转了 180 度，还需要 - el.height()
    y: el.y() as number || matrix.f,
  };
}
