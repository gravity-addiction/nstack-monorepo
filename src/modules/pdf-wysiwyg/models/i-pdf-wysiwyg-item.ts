// import { ToolUtils } from '../providers/tool-utils';
import { TPdfWysiwygToolTypes } from '../typings';

export class IPdfWysiwygItem {
  t: TPdfWysiwygToolTypes; // Type of Item
  id: string; // unique identifier to reference this object
  obj: any; // i-paperwork-* Tool

  constructor(item: any) {
    this.t = item.t || 'text';
    this.id = item.id || this.makeID();
    this.obj = item.obj || {};
  }

  makeID(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
