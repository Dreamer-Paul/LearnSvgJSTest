import type { StrokeData } from "@svgdotjs/svg.js";

export interface ISmartArtOptionTextItem {
  text: string;
  style?: object;
}

export interface ISmartArtOptionIconItem {
  name: string;
  style?: {
    stroke?: StrokeData;
  };
}

export type ISmartArtOptionItem =
  | ISmartArtOptionTextItem
  | ISmartArtOptionIconItem;

class SmartArtOption {
  private data: Record<string, ISmartArtOptionItem>;

  constructor(initialData: Record<string, ISmartArtOptionItem>) {
    this.data = initialData;
  }

  setData(nextData: Record<string, ISmartArtOptionItem>) {
    this.data = nextData;
  }

  getItem(name: string) {
    return this.data[name];
  }

  setItem(name: string, value: ISmartArtOptionItem) {
    this.data[name] = value;
  }

  getText(name: string) {
    // console.log(this.data, `text-${name}`);

    return this.data[`text-${name}`] as ISmartArtOptionTextItem | undefined;
  }

  getIcon(name: string) {
    return this.data[`icon-${name}`] as ISmartArtOptionIconItem | undefined;
  }

  getAllIconName() {
    return [
      ...new Set([
        ...Object.keys(this.data)
          .filter((key) => key.startsWith("icon-"))
          .map((item) => {
            const optionItem = this.data[item];
            if ("name" in optionItem) {
              return optionItem.name;
            }
            return "";
          }),
      ]),
    ];
  }

  addItem(index: number) {
    index = index + 1;
    const newData: Record<string, ISmartArtOptionItem> = {};

    Object.keys(this.data).forEach((key) => {
      const match = key.match(/(text|icon)-(\d+)(.*)/);
      if (match) {
        const [, type, id, suffix] = match;
        const numId = parseInt(id, 10);
        if (numId >= index) {
          newData[`${type}-${numId + 1}${suffix}`] = this.data[key];
        } else {
          newData[key] = this.data[key];
        }
      } else {
        newData[key] = this.data[key];
      }
    });

    this.data = newData;
  }

  removeItem(index: number) {
    index = index + 1;
    const newData: Record<string, ISmartArtOptionItem> = {};

    Object.keys(this.data).forEach((key) => {
      const match = key.match(/(text|icon)-(\d+)(.*)/);
      if (match) {
        const [, type, id, suffix] = match;
        const numId = parseInt(id, 10);
        if (numId > index) {
          newData[`${type}-${numId - 1}${suffix}`] = this.data[key];
        } else if (numId < index) {
          newData[key] = this.data[key];
        }
      } else {
        newData[key] = this.data[key];
      }
    });

    this.data = newData;
  }
}

export default SmartArtOption;
