import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { series as async_series } from 'async';
import { interval, Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';


import { IPdfWysiwygCross } from '../models/i-pdf-wysiwyg-cross';
import { IPdfWysiwygEllipse } from '../models/i-pdf-wysiwyg-ellipse';
import { IPdfWysiwygImage } from '../models/i-pdf-wysiwyg-image';
import { IPdfWysiwygItem } from '../models/i-pdf-wysiwyg-item';
import { IPdfWysiwygLine } from '../models/i-pdf-wysiwyg-line';
import { IPdfWysiwygNumCircle } from '../models/i-pdf-wysiwyg-num-circle';
import { IPdfWysiwygTextbox } from '../models/i-pdf-wysiwyg-textbox';
import { IPdfWysiwygPage, IPdfWysiwygToolTypes, TPdfWysiwygToolTypes } from '../typings';

import { ToolUtils } from './tool-utils.service';

declare const blobStream: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const PDFDocument: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const SVGtoPDF: any;

@Injectable()
export class PdfWysiwygService implements OnDestroy {
  subscriptions: Subscription = new Subscription();
  public drawObs: Subject<any> = new Subject();
  public saveObs: Subject<any> = new Subject();

  canvas: any;
  ctx: any;
  editable!: boolean;
  ident!: string;
  ver!: string;
  dataId!: string;
  newDataId!: string;
  custId!: string;
  save = true;
  set inchWidth(wid: number) {
 this.pixelWidth = (wid * 72);
}
  get inchWidth() {
 return (this.pixelWidth / 72);
}
  set inchHeight(hei: number) {
 this.pixelHeight = (hei * 72);
}
  get inchHeight() {
 return (this.pixelHeight / 72);
}
  pixelWidth = 1;
  pixelHeight = 1;
  viewScale = 1;
  pdfScale = 1;
  pdfLayout = 'landscape';
  pdfSvg = 'assets/blankforms/letter-landscape.svg';
  drag = false;
  closeEnough = 10;
  dragTL = false;
  dragBL = false;
  dragTR = false;
  dragBR = false;
  dragWhole = false;
  isDrag = false;
  isDown = false;
  startX!: number;
  startY!: number;
  hasFocus = false;
  custLock = true;

  pageNum = 1;
  pagesOfItems: IPdfWysiwygPage[] = [];
  allItems: IPdfWysiwygItem[] = [];
  activeItem: IPdfWysiwygItem | null = null;
  // itemsUpdated: EventEmitter<IPdfWysiwygItem[]> = new EventEmitter();

  toolType: TPdfWysiwygToolTypes = 'selection';
  showInfo = 'text';
  displayMode = 'edit'; // 'edit', 'input'
  showLayers = false;

  dragOffsets: any = {x: 0, y: 0, w: 0, h: 0};
  fontSize = 15;
  itemChanged: EventEmitter<IPdfWysiwygItem>;

  _hooks: any = {
    preSave: [],
    save: [],
    postSave: [],
    autopopulate: [],
  };

  toolboxDefaults = {
    'num-circle': IPdfWysiwygNumCircle,
    textbox: IPdfWysiwygTextbox,
    cross: IPdfWysiwygCross,
    image: IPdfWysiwygImage,
    line: IPdfWysiwygLine,
    ellipse: IPdfWysiwygEllipse,
    selection: null,
  };

  constructor() {
    this.subscriptions.add(
      this.drawObs.asObservable().pipe(
        switchMap(() => {
          this.drawAll();
          return of(true);
        })
      ).subscribe()
    );

    this.itemChanged = new EventEmitter();
    this.subscriptions.add(
      this.itemChanged.pipe(
        tap((item: any) => {
 this.activeItem = item;
})
      ).subscribe()
    );
    this.addPage(0); // Template Page
    this.addPage(1); // First Page
    this.changePage(1);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  public addHook(key: 'preSave' | 'save' | 'postSave' | 'autopopulate', hook: any) {
    this._hooks[key].push(hook);
  }
  public runHooks(key: string): Promise<boolean> {
    return new Promise(resolve => {
      async_series(this._hooks[key], (err: any) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public prevPage() {
    this.pageNum -= 1;
    if (this.pageNum < 1) {
 this.pageNum = this.pagesOfItems.length - 1;
}
    this.changePage(this.pageNum);
  }

  public nextPage() {
    this.pageNum += 1;
    if (this.pageNum >= this.pagesOfItems.length) {
      this.pageNum = 1;
    }
    this.changePage(this.pageNum);
  }

  public addPage(pg: number | null = null) {
    const pageItem = { allItems: [], layout: this.pdfLayout, svg: this.pdfSvg };
    this.pagesOfItems[(pg === null) ? this.pagesOfItems.length : pg] = pageItem;
    return pageItem;
  }

  public newPage() {
    this.addPage();
    this.pageNum = this.pagesOfItems.length - 1;
    this.changePage(this.pageNum);
  }
  public changePage(pg: number) {
    if (this.pagesOfItems.length >= pg) {
      this.pageNum = pg;
      this.allItems = this.parseDataset(this.pagesOfItems[this.pageNum].allItems);
      this.drawObs.next(true);
    }
  }

  public changeItem(item: any) {
    this.itemChanged.emit(item);
  }

  public parseDataset(data: any): IPdfWysiwygItem[] {
    const storageVersion = data || [];
    const sLen = storageVersion.length;
    const ret: IPdfWysiwygItem[] = [];

    for (let s = 0; s < sLen; s++) {
      const item = storageVersion[s];
      const tBox = this.getTBox(item.t) || false;
      if (!tBox) {
 continue;
}
      item.obj = new tBox(item.obj);
      ret.push(new IPdfWysiwygItem(item));
    }

    return ret;
  }

  public loadDataset(data: any) {
    this.allItems = this.parseDataset(data);
    this.pagesOfItems[this.pageNum].allItems = this.allItems;
    // const dataset = this.parseDataset(data);
    // this.itemsUpdated.emit(dataset);
  }

  public newItem(item: IPdfWysiwygItem): void {
    this.activeItem = item;
    this.allItems.push(item);
    this.pagesOfItems[this.pageNum].allItems = this.allItems;
  }

  public createItem(x: number, y: number, t: TPdfWysiwygToolTypes,
                    w: number | null = null, h: number | null = null,
                    params: any = {}): void {
    const tBox = this.getTBox(t); // this.tookbolDefaults[t] || false;
    if (!tBox) {
 return;
}

    const dItem = Object.assign({}, params);
    dItem.x = x;
    dItem.y = y;
    dItem.w = w;
    dItem.h = h;

    this.newItem(new IPdfWysiwygItem({t, obj: new tBox(dItem)}));
  }

  public copyItem(item: IPdfWysiwygItem): void {
    const tBox = this.getTBox(item.t);
    const nItem = Object.assign({}, item.obj);
    const pdfItem = new IPdfWysiwygItem({t: item.t, obj: new tBox(nItem)});
    this.allItems.push(pdfItem);
    this.pagesOfItems[this.pageNum].allItems = this.allItems;
    this.changeItem(pdfItem);
  }

  public removeItem(item: IPdfWysiwygItem) {
    if (item.id === (this.activeItem || {}).id) {
 this.changeItem(null);
}
    this.allItems = this.allItems.filter(ele => ele.id !== item.id);
    this.pagesOfItems[this.pageNum].allItems = this.allItems;
  }

  public clearItems() {
    this.allItems = [];
    this.pagesOfItems[this.pageNum].allItems = this.allItems;
  }

  public showItems() {
    console.log(this.allItems);
  }

  public cleanItems() {
    const rLen = this.allItems.length;
    for (let r = 0; r < rLen; r++) {
      const item = this.allItems[r];
      if (typeof item.obj.clean === 'function') {
        item.obj.clean();
      }
    }
    this.pagesOfItems[this.pageNum].allItems = this.allItems;
  }

  public setTool(t: any) {
    if (this.toolType === t) {
      this.changeItem(null);
    } else {
      this.toolType = t;
    }
  }

  public clearDrag() {
    this.isDrag = this.dragTL = this.dragTR = this.dragBL = this.dragBR = this.dragWhole = false;
  }

  getTBox(t: TPdfWysiwygToolTypes): any {
    const tBox = this.toolboxDefaults[t] || false;
    if (!tBox) {
 console.log('Toolbox Item not installed correctly'); return;
}
    return tBox;
  }

  saveFormVersion(data: any, form: string, version?: string): Observable<any> {
    let url = `pdf-wysiwyg/forms/${encodeURIComponent(form)}/versions`;
    if (version) {
 url += `/${encodeURIComponent(version)}`;
}
    return of(true); // this.madame.authPost(url, { data: data }).map((res: any) => res.json());
  }

  getForms(form?: string): Observable<any> {
    let url = 'pdf-wysiwyg/forms';
    if (form) {
 url += `/${encodeURIComponent(form)}`;
}

    return of(true); //
//    return this.madame.authGet(url).
//        map((data: any) => data.json()).
//        share();
  }

  getFormVersions(form: string, version?: string): Observable<any> {
    let url = `pdf-wysiwyg/forms/${encodeURIComponent(form)}/versions`;
    if (version) {
 url += `/${encodeURIComponent(version)}`;
}

    return of(true); //
//    return this.madame.authGet(url).
//        map((data: any) => data.json()).
//        share();
  }

  sendAction(form: string, version: string, action: string, data?: any): Observable<any> {
    return of(true); //
//    return this.madame.authPost(`pdf-wysiwyg/forms/${encodeURIComponent(form)}/versions` +
//              `/${encodeURIComponent(version)}/${encodeURIComponent(action)}`, { data: data })
//              .map((res: any) => res.json());
  }

  public requiredInput(item: any): boolean {
    if (item.obj.required && item.obj.val.txt === '' || item.obj.val.txt === null) {
      const res = prompt(item.id.toUpperCase() + ' is required. Please put a response.');
      if (res !== null) {
        item.obj.val = { txt: res };
      } else {
 return false;
}
    }
    return true;
  }


  clearCanvas() {
    if (this.displayMode !== 'edit') {
 return;
}

    if (this.editable) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
  }

  drawItems(items: IPdfWysiwygItem[]) {
    const rLen = items.length;
    for (let r = rLen - 1; r > -1; r--) {
      const item = ToolUtils.cleanCoords(items[r].obj);
      let active = false;

      if (this.activeItem && this.activeItem.id === items[r].id) {
        active = true;
      }

      if (typeof item.draw === 'function') {
        item.draw(this.ctx, active, this.viewScale, this.showInfo);
      }
    }
  }

  // Draw all items in stack
  drawAll() {

    if (this.displayMode !== 'edit') {
 return;
}
    this.clearCanvas();

    this.drawItems(this.pagesOfItems[0].allItems);
    this.drawItems(this.allItems);
  }

  /*drawCircle(r) {
    if (this.displayMode !== 'edit') { return; }

    const item = this.allItems[r].obj;

    if (this.allItems[r].id === this.allItems.id) {
      this.ctx.fillStyle = 'rgba(255, 30, 30, 0.25)';
    } else {
      this.ctx.fillStyle = 'rgba(30, 255, 30, 0.25)';
    }
    this.ctx.beginPath();
    this.ctx.arc(item.x, item.y, item.w / 2, 0, 2 * Math.PI);
    this.ctx.fill();
  }*/


  // PDF Functions
  async makePDF(_forceDownload = false) {
    const doc = new PDFDocument({
      margin: 0,
      autoFirstPage: false,
    });
    const pdfWidth = this.pixelWidth;
    const pdfHeight = this.pixelHeight;

    // pointWidth = (pdfWidth / 72) * 96,
    // pointHeight = (pdfHeight / 72) * 96,
    const pdfScale = this.pdfScale || 1;

/*
console.log('Css', cssWidth, cssHeight);
console.log('pdf', pdfWidth, pdfHeight);
// console.log('point', pointWidth, pointHeight);
console.log('pdfScale', pdfScale);
*/

    const stream = doc.pipe(blobStream());

    const pLen = this.pagesOfItems.length;
    const pageTemplate: any = this.pagesOfItems[0] || {};

    for (let p = 1; p < pLen; p++) {
      const pageItem = this.pagesOfItems[p];

      const addPageOptions = {
        margins: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
        layout: pageItem.layout || pageTemplate.layout,
        size: 'letter', // [pdfWidth, pdfHeight],
      };
      doc.addPage(addPageOptions);

      doc.save();

      /*
      const xhr = ToolUtils.fetchImage(pageItem.svg);
      SVGtoPDF(doc, (xhr.responseXML || {}).documentElement, 0, 0, { scale: pdfScale });
      */

      doc.font('Courier-Bold');
      doc.fontSize(9);

      // Page 0 as Template
      if (pageTemplate.allItems) {
        const ftLen = pageTemplate.allItems.length;
        for (let f = ftLen - 1; f >= 0 ; f--) {
          const item = pageTemplate.allItems[f];

          if (typeof item.obj.writePDF === 'function') {
            await item.obj.writePDF(doc, pdfScale);
          }
        }
      }

      // Items for This Page
      const fLen = pageItem.allItems.length;
      for (let f = fLen - 1; f >= 0; f--) {
        const item = pageItem.allItems[f];

        if (typeof item.obj.writePDF === 'function') {
          await item.obj.writePDF(doc, pdfScale);
        }
      }

    }

    // Static Coded PDF items
    // use doc.



    // const t = this;
    stream.on('finish', () => {
      // t.downloadTag.nativeElement.removeAttribute('download');

      if (window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(stream.toBlob('application/pdf'),
           ToolUtils.generateFilename()
       );
      } else {
        const url = stream.toBlobURL('application/pdf');

//        t.downloadTag.nativeElement.href = url;
//        if (forceDownload) {
//          t.downloadTag.nativeElement.setAttribute('download',
//              ToolUtils.generateFilename());
//        }
        // t.downloadTag.nativeElement.click();

        // ToolUtils.getNativeWindow().location.assign(url);
        window.open(url);
        // ToolUtils.getNativeWindow().URL.revokeObjectURL(url);
      }
    });

    doc.end();
  }
// eslint-disable-next-line max-lines
}
