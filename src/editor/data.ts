export interface ISmartArtDataItem {
  text: string;
}

export interface ISmartArtData {
  title: string;
  items: ISmartArtDataItem[];
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

    console.log("items", this.data.items);
  }
}

export default SmartArtData;
