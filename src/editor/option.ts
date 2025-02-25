export interface ISmartArtOptionTextItem {
  text: string;
}

export interface ISmartArtOptionIconItem {
  name: string;
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

  setItem(name: string, value: ISmartArtOptionItem) {
    this.data[name] = value;
  }

  getText(name: string) {
    console.log(this.data, `text-${name}`);

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

  addItem(index: number, value: ISmartArtOptionItem) {
    index = index + 1;
    const newData: Record<string, ISmartArtOptionItem> = {};

    Object.keys(this.data).forEach((key) => {
      const match = key.match(/(text|icon)-(\d+)/);
      if (match) {
        const [, type, id] = match;

        console.log(id);

        const numId = parseInt(id, 10);
        if (numId >= index) {
          newData[`${type}-${numId + 1}`] = this.data[key];
        } else {
          newData[key] = this.data[key];
        }
      } else {
        newData[key] = this.data[key];
      }
    });

    // Todo: 后续应该是模板比较缺少的 Option 然后添加
    newData[`text-${index}`] = value;

    this.data = newData;
  }

  removeItem(index: number) {
    index = index + 1;
    const newData: Record<string, ISmartArtOptionItem> = {};

    Object.keys(this.data).forEach((key) => {
      const match = key.match(/(text|icon)-(\d+)/);
      if (match) {
        const [, type, id] = match;
        const numId = parseInt(id, 10);
        if (numId > index) {
          newData[`${type}-${numId - 1}`] = this.data[key];
        } else if (numId < index) {
          console.log("numId", numId, index, this.data[key]);

          newData[key] = this.data[key];
        }
      } else {
        newData[key] = this.data[key];
      }
    });

    // Todo: 后续应该是模板比较缺少的 Option 然后移除

    this.data = newData;
  }
}

export default SmartArtOption;
