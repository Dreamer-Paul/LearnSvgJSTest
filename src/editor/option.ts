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
}

export default SmartArtOption;
