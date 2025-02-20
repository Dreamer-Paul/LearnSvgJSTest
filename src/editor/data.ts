export interface ISmartArtDataItem {
  text: string;
  icon?: string;
}

export interface ISmartArtData {
  title: string;
  items: ISmartArtDataItem[];
  style: string;
}

class SmartArtData {
  private data: ISmartArtData;

  constructor(initialData: ISmartArtData) {
    this.data = initialData;
  }

  setData(nextData: ISmartArtData) {
    this.data = nextData;
  }

  get count() {
    return this.data.items.length;
  }

  getItemText(index: number) {
    return this.data.items[index].text;
  }

  getItemIcon(index: number) {
    return this.data.items[index].icon;
  }

  addItem(index: number) {
    this.data.items.splice(index - 1, 0, { text: "New Item" });
  }

  removeItem(index: number) {
    this.data.items.splice(index - 1, 1);
  }

  updateItem(index: number, values: Partial<ISmartArtDataItem>) {
    this.data.items[index] = {
      ...this.data.items[index],
      ...values,
    };
  }

  get title() {
    return this.data.title;
  }

  updateTitle(text: string) {
    this.data.title = text;
  }

  get style() {
    return this.data.style;
  }

  updateStyle(style: string) {
    this.data.style = style;
  }

  getIcons() {
    return [...new Set(this.data.items.map((item) => item.icon))];
  }
}

export default SmartArtData;
