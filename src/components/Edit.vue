<script setup lang="ts">
import { onMounted, reactive } from "vue";

const svgPostion = reactive({
  left: 0,
  top: 0,
});

const inputWrap = reactive({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});

const svgText = reactive({
  text1: "AI 搜索引擎比较",
});

function updateInputWrap(
  newWidth: number,
  newHeight: number,
  newX: number,
  newY: number
) {
  inputWrap.width = newWidth;
  inputWrap.height = newHeight;
  inputWrap.x = newX;
  inputWrap.y = newY;
}

function handleSvgClick(event: Event) {
  const target = event.target as HTMLElement;

  // 检查目标元素是否具有 class 为 'smm-node'
  if (target.classList.contains("smm-node")) {
    // 执行相应的逻辑
    console.log('Clicked on an element with class "smm-node":', target);
  } else if (target.tagName === "foreignObject") {
    console.log("Clicked on a foreignObject:", target);

    const rect = target.getBoundingClientRect();

    console.log("rect", rect.x, rect.y);

    const x = rect.left - (svgPostion?.left || 0); // 获取相对于 #svgContainer 的 x 坐标
    const y = rect.top - (svgPostion?.top || 0); // 获取相对于 #svgContainer 的 y 坐标
    console.log(
      "target",
      target,
      svgPostion,
      "relative x:",
      x,
      "relative y:",
      y
    );

    const width = parseInt(target?.getAttribute("width") || "0", 10);
    const height = parseInt(target?.getAttribute("height") || "0", 10);

    updateInputWrap(width, height, x, y);
  } else {
    console.log("Clicked on a different element:", target);

    updateInputWrap(0, 0, 0, 0);
  }
}

onMounted(() => {
  const svgContainer = document.querySelector("#svgItem");

  if (svgContainer) {
    const svgRect = svgContainer.getBoundingClientRect();
    svgPostion.left = svgRect.left;
    svgPostion.top = svgRect.top;
  }
});
</script>

<style scoped>
html,
body,
input,
textarea {
  font-family: sans-serif;
  font-size: 16px;
  line-height: 1.6;
}

.svg--container {
  position: relative;
  border: 1px solid black;
  display: inline-block;
}
.svg--container svg {
  position: relative;
  z-index: 0;
}

.svg--input__container {
  position: absolute;
  margin: 0;
  padding: 0;
  border: 1px solid red;
}

.svg--input {
  width: 100%;
  height: 100%;
  text-align: right;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;

  margin: 0;
  padding: 0;
}

#svgItem .smm-node div,
#svgItem p {
  pointer-events: none;
}

foreignObject {
  border: 1px solid blue;
}

foreignObject div,
foreignObject p {
  padding: 0;
  margin: 0;
}
</style>

<template>
  <div>
    <h1>编辑</h1>
    <div class="svg--container">
      <svg
        width="794"
        height="638"
        viewBox="0 0 794 638"
        class=""
        style="
          fill: none;
          stroke: none;
          fill-rule: evenodd;
          clip-rule: evenodd;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-miterlimit: 1.5;
        "
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        id="svgItem"
        @click="handleSvgClick"
      >
        <rect
          id=""
          x="0"
          y="0"
          width="794"
          height="638"
          style="fill: none"
        ></rect>
        <g id="items" style="isolation: isolate">
          <g id="blend" style="mix-blend-mode: normal">
            <g
              id="g-root-tf_m98bty4r6adj-fill"
              data-item-order="-503712"
              transform="translate(-9, -9)"
            ></g>
            <g
              id="g-root--1.cu_sy_htendy4rep6w-fill"
              data-item-order="-151404"
              transform="translate(278, 243)"
            ></g>
            <g
              id="g-root-0.line-start_sy_ddl59i4repz5-fill"
              data-item-order="-151399"
              transform="translate(237, 345)"
            ></g>
            <g
              id="g-root-6.line_sy_ddl59i4repz6-fill"
              data-item-order="-151393"
              transform="translate(347.5, 345)"
            ></g>
            <g
              id="g-root-5.line_sy_ddl59i4repz7-fill"
              data-item-order="-151387"
              transform="translate(347.5, 345)"
            ></g>
            <g
              id="g-root-4.line_sy_4hy50m4reqrw-fill"
              data-item-order="-151381"
              transform="translate(347.5, 345)"
            ></g>
            <g
              id="g-root-3.line_sy_4hy50m4reqrx-fill"
              data-item-order="-151375"
              transform="translate(348, 303)"
            ></g>
            <g
              id="g-root-2.line_sy_4hy50m4reqry-fill"
              data-item-order="-151369"
              transform="translate(347.5, 219)"
            ></g>
            <g
              id="g-root-1.line_sy_4hy50m4reqrz-fill"
              data-item-order="-151363"
              transform="translate(347.5, 135)"
            ></g>
            <g
              id="g-root-lapt_1cw59eu4rlrt2-fill"
              data-item-order="0"
              transform="translate(615, 279)"
            ></g>
            <g
              id="g-root-tx__1hbcdly4r69l3-fill"
              data-item-order="0"
              transform="translate(675, 291)"
            >
              <g id="tx__1hbcdly4r69l3-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="12" y="33.5" dominant-baseline="ideographic">
                      用户体验
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx__1cvivhi4r6add-fill"
              data-item-order="0"
              transform="translate(675, 207)"
            >
              <g id="tx__1cvivhi4r6add-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="12" y="33.5" dominant-baseline="ideographic">
                      性能
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx__vv1i4r6akp-fill"
              data-item-order="0"
              transform="translate(675, 543)"
            >
              <g id="tx__vv1i4r6akp-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="12" y="33.5" dominant-baseline="ideographic">
                      选择效率
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="g-root-grap_24mw64rerk8-fill"
              data-item-order="0"
              transform="translate(183, 321)"
            ></g>
            <g
              id="g-root-3_18lbjza4rls01-fill"
              data-item-order="0"
              transform="translate(615, 195)"
            ></g>
            <g
              id="g-root-tx__1cvivhi4r6adf-fill"
              data-item-order="0"
              transform="translate(675, 123)"
            >
              <g id="tx__1cvivhi4r6adf-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="12" y="33.5" dominant-baseline="ideographic">
                      功能
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="g-root-func_1um6ew64r4wzk-fill"
              data-item-order="0"
              transform="translate(615, 111)"
            ></g>
            <g
              id="g-root-stac_1hgyk864rhkox-fill"
              data-item-order="0"
              transform="translate(615, 363)"
            ></g>
            <g
              id="g-root-tx__1lqjena4r6byl-fill"
              data-item-order="0"
              transform="translate(675, 375)"
            >
              <g id="tx__1lqjena4r6byl-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="12" y="33.5" dominant-baseline="ideographic">
                      信息处理
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="g-root-cryi_1d30hd24raj9j-fill"
              data-item-order="0"
              transform="translate(615, 447)"
            ></g>
            <g
              id="g-root-tx__1um6ew64r6b5v-fill"
              data-item-order="0"
              transform="translate(675, 459)"
            >
              <g id="tx__1um6ew64r6b5v-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="12" y="33.5" dominant-baseline="ideographic">
                      结果质量
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="g-root-1_5vkkm4r2232-fill"
              data-item-order="0"
              transform="translate(615, 531)"
            ></g>
            <g
              id="g-root-tx_ai_13zvv8m4r6b65-fill"
              data-item-order="0"
              transform="translate(315, 39)"
            >
              <g id="tx_ai_13zvv8m4r6b65-fill" stroke="none" fill="#484848">
                <g>
                  <text font-size="20px" font-family="Roboto, sans-serif">
                    <tspan x="13.79" y="33.5" dominant-baseline="ideographic">
                      揭示 AI 搜索引擎的差异
                    </tspan>
                  </text>
                </g>
              </g>
            </g>
            <g
              id="text-1"
              data-item-order="0"
              transform="translate(15, 333)"
              class="smm-node"
              style="border: 1px solid red"
            >
              <g
                id="tx_ai_dbpwbq4r6c5j-fill"
                stroke="none"
                fill="#484848"
                class="smm-node"
              >
                <g class="smm-node">
                  <foreignObject width="120" height="60" x="0" y="0"
                    ><div>
                      <p
                        style="
                          text-align: right;
                          white-space: pre-wrap;
                          word-break: break-all;
                          overflow-wrap: break-word;
                          font-size: 16px;
                          line-height: 1.6;
                        "
                      >
                        {{ svgText.text1 }}
                      </p>
                    </div></foreignObject
                  >
                </g>
              </g>
            </g>
            <g
              id="g-root-tf_m98bty4r6adj-stroke"
              data-item-order="-503712"
              transform="translate(-9, -9)"
            ></g>
            <g
              id="g-root--1.cu_sy_htendy4rep6w-stroke"
              data-item-order="-151404"
              transform="translate(278, 243)"
            >
              <g
                id="-1.cu_sy_htendy4rep6w-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#484848"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 125 34L 101 10L 10 166L 34 190L 125 34ZM 125 34L 34 190L 216 190L 125 34Z"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-0.line-start_sy_ddl59i4repz5-stroke"
              data-item-order="-151399"
              transform="translate(237, 345)"
            >
              <g
                id="0.line-start_sy_ddl59i4repz5-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#808080"
                stroke-width="2"
              >
                <g><path d="M 10 10L 120.5 10"></path></g>
              </g>
            </g>
            <g
              id="g-root-6.line_sy_ddl59i4repz6-stroke"
              data-item-order="-151393"
              transform="translate(347.5, 345)"
            >
              <g
                id="6.line_sy_ddl59i4repz6-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#e55753"
                stroke-width="2"
              >
                <g>
                  <path d="M 258.27 218.43L 118.5 40.25L 10 10"></path>
                  <path
                    d="M 249.4 217.7L 258.6 218.8L 259.7 209.7"
                    stroke-dasharray="none"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-5.line_sy_ddl59i4repz7-stroke"
              data-item-order="-151387"
              transform="translate(347.5, 345)"
            >
              <g
                id="5.line_sy_ddl59i4repz7-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#de8431"
                stroke-width="2"
              >
                <g>
                  <path d="M 257.89 134.82L 112 28.25L 10 10"></path>
                  <path
                    d="M 249.2 136.5L 258.3 135.1L 256.9 126"
                    stroke-dasharray="none"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-4.line_sy_4hy50m4reqrw-stroke"
              data-item-order="-151381"
              transform="translate(347.5, 345)"
            >
              <g
                id="4.line_sy_4hy50m4reqrw-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#e0cb15"
                stroke-width="2"
              >
                <g>
                  <path d="M 257.55 52.04L 105 16L 10 10"></path>
                  <path
                    d="M 250.2 57L 258 52.2L 253.2 44.3"
                    stroke-dasharray="none"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-3.line_sy_4hy50m4reqrx-stroke"
              data-item-order="-151375"
              transform="translate(348, 303)"
            >
              <g
                id="3.line_sy_4hy50m4reqrx-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#92bd39"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 257.55 10.429932L 97.75 45.749932L 10 51.999932"
                  ></path>
                  <path
                    d="M 253.1 18.029932L 258 10.329932L 250.3 5.329932"
                    stroke-dasharray="none"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-2.line_sy_4hy50m4reqry-stroke"
              data-item-order="-151369"
              transform="translate(347.5, 219)"
            >
              <g
                id="2.line_sy_4hy50m4reqry-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#3cc583"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 257.82 11.080078L 90.75 118.000078L 10 136.000078"
                  ></path>
                  <path
                    d="M 256.3 19.780078L 258.2 10.780078L 249.3 8.880078"
                    stroke-dasharray="none"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-1.line_sy_4hy50m4reqrz-stroke"
              data-item-order="-151363"
              transform="translate(347.5, 135)"
            >
              <g
                id="1.line_sy_4hy50m4reqrz-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#1eabda"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 10 219.999932L 83.5 189.999932L 258.1 11.43"
                  ></path>
                  <path
                    d="M 258.6 20.229932L 258.5 11.029932L 249.3 11.129932"
                    stroke-dasharray="none"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-lapt_1cw59eu4rlrt2-stroke"
              data-item-order="0"
              transform="translate(615, 279)"
            >
              <g
                id="lapt_1cw59eu4rlrt2-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#92bd39"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 32.285713 22C 32.285713 26.73387 36.123276 30.571428 40.857143 30.571428C 45.591011 30.571428 49.428574 26.73387 49.428574 22C 49.428574 17.26613 45.591011 13.428572 40.857143 13.428572C 36.123276 13.428572 32.285713 17.26613 32.285713 22M 40.857143 39.142857C 44.951847 39.133724 48.88147 40.756302 51.776871 43.651699C 54.672268 46.5471 56.294846 50.476723 56.285713 54.571426M 32.285713 37.428574L 11.714286 37.428574L 15.142858 54.57143L 35.714287 54.57143L 32.285713 37.428574ZM 22 46L 25.428572 46M 35.714287 54.57143L 46 54.57143"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx__1hbcdly4r69l3-stroke"
              data-item-order="0"
              transform="translate(675, 291)"
            ></g>
            <g
              id="g-root-tx__1cvivhi4r6add-stroke"
              data-item-order="0"
              transform="translate(675, 207)"
            ></g>
            <g
              id="g-root-tx__vv1i4r6akp-stroke"
              data-item-order="0"
              transform="translate(675, 543)"
            ></g>
            <g
              id="g-root-grap_24mw64rerk8-stroke"
              data-item-order="0"
              transform="translate(183, 321)"
            >
              <g
                id="grap_24mw64rerk8-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#484848"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 14.98 30.219999C 14.899816 29.556355 14.859743 28.888474 14.860001 28.220001C 14.851564 21.009327 19.968395 14.810095 27.049921 13.451458C 34.131447 12.092822 41.179237 15.958193 43.84 22.66M 40.5 38.84L 44.84 43.18M 56 50.380001C 56.802612 51.127884 57.132996 52.254223 56.861542 53.317158C 56.590088 54.380089 55.76009 55.210087 54.697155 55.481541C 53.634224 55.752995 52.507885 55.422611 51.760002 54.620003L 44 46.84C 43.621376 46.464466 43.408401 45.953274 43.408401 45.419998C 43.408401 44.886726 43.621376 44.375534 44 44L 45.419998 42.580002C 45.795532 42.201374 46.306725 41.988403 46.84 41.988403C 47.373276 41.988403 47.884468 42.201374 48.259998 42.580002ZM 46.02 12.5L 54.02 12.5L 54.02 20.5M 44.880001 29.120001C 44.475258 35.92099 39.54364 41.597744 32.866005 42.949226C 26.188374 44.300705 19.43746 40.988373 16.42 34.880001M 54 12.5L 36.200001 30.32C 35.419926 31.095448 34.160072 31.095448 33.379997 30.32L 28.6 25.52C 27.819925 24.744553 26.560076 24.744553 25.779999 25.52L 11.1 40.200001"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-3_18lbjza4rls01-stroke"
              data-item-order="0"
              transform="translate(615, 195)"
            >
              <g
                id="3_18lbjza4rls01-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#3cc583"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 26.5 44.5L 26.5 38.5C 26.5 37.395432 25.604568 36.5 24.5 36.5L 13.5 36.5C 12.395431 36.5 11.5 37.395432 11.5 38.5L 11.5 56.5L 56.5 56.5L 56.5 44.5ZM 23.5 36.5L 14.5 36.5L 16 11.5L 22 11.5L 23.5 36.5ZM 29.5 50.5L 32.5 50.5M 38.5 50.5L 41.5 50.5M 47.5 50.5L 50.5 50.5M 15.572001 18.5L 22.428001 18.5M 40.330002 35.556C 40.329681 37.182152 41.64785 38.500572 43.273998 38.500572C 44.90015 38.500572 46.218315 37.182152 46.217999 35.556C 46.218315 33.929848 44.90015 32.611427 43.273998 32.611427C 41.64785 32.611427 40.329681 33.929848 40.330002 35.556M 53.627998 38.312L 52.312 36.891998C 51.61375 36.138184 51.61375 34.973816 52.312 34.220001L 54.334 32.040001C 55.119774 31.19714 55.264259 29.940475 54.690269 28.941278C 54.116283 27.942081 52.957943 27.433823 51.834 27.688L 48.944 28.356001C 47.944466 28.58707 46.937218 28.002499 46.641998 27.019999L 45.773998 24.17C 45.440533 23.068239 44.425117 22.314667 43.273998 22.314667C 42.122879 22.314667 41.107468 23.068239 40.773998 24.169998L 39.905998 27.02C 39.609085 28.002129 38.601883 28.586166 37.602005 28.356001L 34.714001 27.688C 33.589699 27.432571 32.43029 27.940376 31.855644 28.939917C 31.281 29.939459 31.425545 31.196917 32.211998 32.040001L 34.234001 34.220001C 34.932251 34.973816 34.932251 36.138184 34.234001 36.891998L 32.919998 38.312"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx__1cvivhi4r6adf-stroke"
              data-item-order="0"
              transform="translate(675, 123)"
            ></g>
            <g
              id="g-root-func_1um6ew64r4wzk-stroke"
              data-item-order="0"
              transform="translate(615, 111)"
            >
              <g
                id="func_1um6ew64r4wzk-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#1eabda"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 10 10M 37 34L 19 12L 49 12L 49 15M 10 10M 37 34L 19 56L 49 56L 49 53"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-stac_1hgyk864rhkox-stroke"
              data-item-order="0"
              transform="translate(615, 363)"
            >
              <g
                id="stac_1hgyk864rhkox-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#e0cb15"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 13.09 26.681999L 42.363998 26.681999C 42.363998 26.681999 44.453999 26.681999 44.453999 28.771999L 44.453999 51.773998C 44.453999 51.773998 44.453999 53.863998 42.363998 53.863998L 13.09 53.863998C 13.09 53.863998 11 53.863998 11 51.773998L 11 28.771999C 11 28.771999 11 26.681999 13.09 26.681999M 11 33.02L 44.453999 33.02M 11 46.751999L 44.453999 46.751999M 11 40.066002L 44.453999 40.066002M 26.681999 33.02L 26.681999 53.863998M 35.568001 33.02L 35.568001 53.863998M 19.364 20.4L 48.636002 20.4C 49.192223 20.399996 49.725544 20.6215 50.118103 21.015558C 50.510658 21.409616 50.730125 21.943783 50.728001 22.5L 50.728001 49.681999M 25.636 14.136L 54.91 14.136C 56.065056 14.136 57.001102 15.072944 56.999996 16.228001L 57 43.400002"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx__1lqjena4r6byl-stroke"
              data-item-order="0"
              transform="translate(675, 375)"
            ></g>
            <g
              id="g-root-cryi_1d30hd24raj9j-stroke"
              data-item-order="0"
              transform="translate(615, 447)"
            >
              <g
                id="cryi_1d30hd24raj9j-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#de8431"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 11 34C 11 46.702549 21.297451 57 34 57C 46.702549 57 57 46.702549 57 34C 57 21.297451 46.702549 11 34 11C 21.297451 11 11 21.297451 11 34ZM 27 25.5C 27.276142 25.5 27.5 25.723858 27.5 26C 27.5 26.276142 27.276142 26.5 27 26.5C 26.723858 26.5 26.5 26.276142 26.5 26C 26.5 25.723858 26.723858 25.5 27 25.5M 41 25.5C 40.723858 25.5 40.5 25.723858 40.5 26C 40.5 26.276142 40.723858 26.5 41 26.5C 41.276142 26.5 41.5 26.276142 41.5 26C 41.5 25.723858 41.276142 25.5 41 25.5M 48 35C 48 36.656853 46.656857 38 45 38C 43.343147 38 42 36.656853 42 35C 42 33.344002 45 29 45 29C 45 29 48 33.344002 48 35ZM 25 48C 25 43.029438 29.029438 39 34 39C 38.970562 39 43 43.029438 43 48"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx__1um6ew64r6b5v-stroke"
              data-item-order="0"
              transform="translate(675, 459)"
            ></g>
            <g
              id="g-root-1_5vkkm4r2232-stroke"
              data-item-order="0"
              transform="translate(615, 531)"
            >
              <g
                id="1_5vkkm4r2232-stroke"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="4"
                stroke="#e55753"
                stroke-width="2"
              >
                <g>
                  <path
                    d="M 45 57L 45 51.666C 44.998898 47.984928 42.015076 45.001106 38.334 45.000004L 35 45L 35 36C 35 34.343147 33.656853 33 32 33C 30.343147 33 29 34.343147 29 36L 29 50L 26.422001 47.84C 25.538345 46.778507 23.961491 46.634342 22.9 47.517998C 21.838509 48.401653 21.694344 49.978508 22.577999 51.040001L 27.535999 57M 46.5 24.498001C 46.5 26.430998 48.067005 27.998001 50 27.998001C 51.932999 27.998001 53.5 26.430998 53.5 24.498001C 53.5 22.565004 51.932999 20.998001 50 20.998001C 48.067005 20.998001 46.5 22.565004 46.5 24.498001ZM 57 35C 56.184055 31.800182 53.302212 29.560986 50 29.560986C 46.697788 29.560986 43.815948 31.800182 43 35ZM 14.5 24.498001C 14.5 26.430998 16.067003 27.998001 18 27.998001C 19.932997 27.998001 21.5 26.430998 21.5 24.498001C 21.5 22.565004 19.932997 20.998 18 20.998C 16.067003 20.998 14.5 22.565004 14.5 24.498001ZM 25 35C 24.184053 31.800182 21.302212 29.560986 18 29.560986C 14.697788 29.560986 11.815947 31.800182 11 35ZM 30.5 18.498001C 30.500002 20.430996 32.067005 21.998001 34 21.998001C 35.932999 21.998001 37.5 20.430996 37.5 18.498001C 37.5 16.565004 35.932999 14.998 34 14.998C 32.067005 14.998 30.500002 16.565004 30.500002 18.498001ZM 41 29C 40.184052 25.800182 37.302212 23.560986 34 23.560986C 30.697788 23.560986 27.815947 25.800182 27 29ZM 23 16.998001L 27 16.998001M 25.456001 10.998L 28.766001 13.242001M 42.543999 10.998L 39.234001 13.242001M 41 16.998001L 45 16.998001"
                  ></path>
                </g>
              </g>
            </g>
            <g
              id="g-root-tx_ai_13zvv8m4r6b65-stroke"
              data-item-order="0"
              transform="translate(315, 39)"
            ></g>
            <g
              id="g-root-tx_ai_dbpwbq4r6c5j-stroke"
              data-item-order="0"
              transform="translate(15, 333)"
            ></g>
          </g>
        </g>
      </svg>

      <!-- 输入框 -->
      <div
        class="svg--input__container"
        :style="{
          width: inputWrap?.width + 'px',
          height: inputWrap?.height + 'px',
          left: inputWrap?.x + 'px',
          top: inputWrap?.y + 'px',
        }"
      >
        <textarea class="svg--input" v-model="svgText.text1"></textarea>
      </div>
    </div>
  </div>
</template>
