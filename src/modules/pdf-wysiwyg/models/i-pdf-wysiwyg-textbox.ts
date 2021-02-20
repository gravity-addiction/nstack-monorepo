// import { IPaperworkItem } from './i-paperwork-item';
import { ToolUtils } from '../services/tool-utils.service';

export class IPdfWysiwygTextbox {
  public x: number; // X mouse coord
  public y: number; // Y mouse coord
  public h: number; // Item Height
  public w: number; // Item Width

  public pT: number;
  public pR: number;
  public pB: number;
  public pL: number;

  public set txt(t) {
    this._txt = t;
  }
  public get txt() {
    if (this.textTransform === 'uppercase') {
      return this._txt.toUpperCase();
    } else if (this.textTransform === 'lowercase') {
      return this._txt.toLowerCase();
    } else {
      return this._txt;
    }
  }

  public get val() {
    return { txt: this.txt };
  }
  public set val(v: any) {
    this.txt = v.txt;
  }

  public fontSize: number;
  public fontStyle: string;
  public maxlength: number;
  public options: any;
  public alignment: string;
  public spacing: number;
  public required: boolean;
  public textTransform?: string;
  public overflow?: string;
  public border?: string;
  public transform?: string;
  public boxShadow?: string;
  public shadeEntireArea?: boolean;

  private _txt!: string;

  constructor(item: any) {
    this.x = item.x || ((item.x === 0) ? 0 : 5);
    this.y = item.y || ((item.y === 0) ? 0 : 5);
    this.w = item.w || ((item.w === 0) ? 0 : 300);
    this.h = item.h || ((item.h === 0) ? 0 : 35);

    this.pT = item.pT || ((item.pT === 0) ? 0 : 0);
    this.pR = item.pR || ((item.pR === 0) ? 0 : 0);
    this.pB = item.pB || ((item.pB === 0) ? 0 : 0);
    this.pL = item.pL || ((item.pL === 0) ? 0 : 0);

    this._txt = item.txt || '';
    this.fontSize = item.fontSize || ((item.pL === 0) ? 0 : 15);
    this.fontStyle = item.fontStyle || 'Courier';
    this.options = item.options || {};
    this.alignment = item.alignment || 'left';
    this.spacing = item.spacing || 0;
    this.overflow = item.overflow || '';
    this.maxlength = item.maxlength || '';
    this.textTransform = item.textTransform || 'inherit';
    this.required = item.required || false;
    this.shadeEntireArea = item.shadeEntireArea || true;

    ToolUtils.cleanCoords(this);
  }



  /**
   * Canvas Hooks
   */
  public draw(ctx: any, selected = false, scale = 1, showInfo?: string) {
    // if (this.field !== void 0) { return; }
    const x = this.x;
    const y = this.y;
    const h = this.h;
    const w = this.w;

    if (selected) {
      ctx.strokeStyle = '#FF3333';
      ctx.fillStyle = 'rgba(255, 30, 30, 0.25)';
    } else {
      ctx.strokeStyle = 'transparent';
      ctx.fillStyle = 'transparent';
    }

    ctx.lineWidth = 1;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    // if (showInfo === 'coords') { this.writeCorners(ctx);
    // } else if (showInfo === 'text') {
    this.writeWords(ctx);
    // }

  }

  public hasCollision(x: number, y: number): boolean {
    const left = this.x;
    const right = this.x + this.w;
    const top = this.y;
    const bottom = this.y + this.h;

    return (right >= x && left <= x && bottom >= y && top <= y);
  }




  /**
   * Dragging Hooks
   */
  public checkHandleTL(x: number, y: number): boolean {
    if (ToolUtils.checkCloseEnough(x, this.x, this.w) &&
      ToolUtils.checkCloseEnough(y, this.y, this.h)
    ) {
      return true;
    }
    return false;
  }
  public checkHandleTR(x: number, y: number): boolean {
    if (ToolUtils.checkCloseEnough(x, this.x + this.w, this.w) &&
      ToolUtils.checkCloseEnough(y, this.y, this.h)
    ) {
      return true;
    }
    return false;
  }
  public checkHandleBL(x: number, y: number): boolean {
    if (ToolUtils.checkCloseEnough(x, this.x, this.w) &&
      ToolUtils.checkCloseEnough(y, this.y + this.h, this.h)
    ) {
      return true;
    }
    return false;
  }
  public checkHandleBR(x: number, y: number): boolean {
    if (ToolUtils.checkCloseEnough(x, this.x + this.w, this.w) &&
      ToolUtils.checkCloseEnough(y, this.y + this.h, this.h)
    ) {
      return true;
    }
    return false;
  }

  public checkSwapBRTR(_x: number, y: number): boolean {
    return (y < this.y);
  }
  public checkSwapBRBL(x: number, _y: number): boolean {
    return (x < this.x);
  }
  public checkSwapTRBR(_x: number, y: number): boolean {
    return (y > (this.y + this.h));
  }
  public checkSwapTRTL(x: number, _y: number): boolean {
    return (x < this.x);
  }
  public checkSwapBLTL(_x: number, y: number): boolean {
    return (y < this.y);
  }
  public checkSwapBLBR(x: number, _y: number): boolean {
    return (x > (this.x + this.w));
  }
  public checkSwapTLBL(_x: number, y: number): boolean {
    return (y > (this.y + this.h));
  }
  public checkSwapTLTR(x: number, _y: number): boolean {
    return (x > (this.x + this.w));
  }

  public updateDragTL(x: number, y: number): void {
    this.w += this.x - x;
    this.h += this.y - y;
    this.x = x;
    this.y = y;
  }
  public updateDragTR(x: number, y: number): void {
    this.w = Math.abs(this.x - x);
    this.h += this.y - y;
    this.y = y;
  }
  public updateDragBL(x: number, y: number): void {
    this.w += this.x - x;
    this.h = Math.abs(this.y - y);
    this.x = x;
  }
  public updateDragBR(x: number, y: number): void {
    this.w = Math.abs(this.x - x);
    this.h = Math.abs(this.y - y);
  }



  /**
   * PDF Hooks
   */
  public writePDF(doc: any, convCalc: number) {
    const x = (((this.x * convCalc) / 96) * 72);
    const y = (((this.y * convCalc) / 96) * 72);
    const w = (((this.w * convCalc) / 96) * 72);
    const pL = (((this.pL * convCalc) / 96) * 72);
    const pR = (((this.pR * convCalc) / 96) * 72);
    const pT = (((this.pT * convCalc) / 96) * 72);
    const fontSize = (((this.fontSize * convCalc) / 96) * 72);
    const spacing = (((this.spacing * convCalc) / 96) * 72);

    let opts: any = { width: w - pL - pR };
    if (this.options) {
      opts = Object.assign({}, opts, this.options);
    }
    opts.align = this.alignment;

    if (this.spacing) {
      opts.characterSpacing = spacing;
    }

    const txt = ToolUtils.trimString(doc, 'pdf', this.txt, w - pL - pR);

    let font = this.fontStyle;
    if (font === 'Times') {
      font += '-Roman';
    }

    doc.font(font);
    doc.fontSize(fontSize);
    doc.text(txt, x + pL, y + pT + (fontSize / 4), opts);
  }




  /**
   * Private Class Functions
   */
  private writeCorners(ctx: any) {
    const x = this.x;
    const y = this.y;
    const h = this.h;
    const w = this.w;

    ctx.font = '8px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${x}, ${y}`, x + 5, y + 10);
    ctx.fillText(`${x}, ${y + h}`, x + 5, (y + h) - 2);

    ctx.textAlign = 'right';
    ctx.fillText(`${x + w}, ${y}`, (x + w) - 2, y + 10);
    ctx.fillText(`${x + w}, ${y + h}`, (x + w) - 2, (y + h) - 2);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${w} x ${h}`, (w / 2) + x, (h / 2) + y);
  }

  private writeWords(ctx: any) {
    // const txt = this.txt || '';
    const x = this.x;
    const y = this.y;
    // h = this.h,
    const w = this.w;
    const pL = this.pL;
    const pR = this.pR;
    const pT = this.pT;
    // pB = this.pB,
    const fontSize = this.fontSize;
    const spacing = this.spacing;


    // Default Left alignment
    let writeX = x + pL;
    const writeY = y + pT; // + fontSize;

    if (this.alignment === 'center') {
      writeX = x + (w / 2) + pL;
    } else if (this.alignment === 'right') {
      writeX = x + w - pR;
    }

    ctx.lineBreak = false;
    ctx.ellipsis = true;

    let font = this.fontStyle;
    if (font === 'Times') {
      font += '-Roman';
    }
    ctx.font = `${fontSize}px ${font}`;

    ctx.textAlign = this.alignment;
    ctx.fillStyle = '#000000';
    ctx.textBaseline = 'top';

    const txt = ToolUtils.trimString(ctx, 'canvas', this.txt, w - pL - pR, (this.alignment === 'right'));

    // ctx.fillText(ToolUtils.trimString(ctx, 'canvas', this.txt, w - pL - pR, (this.alignment === 'right')), writeX, writeY);
    if (this.spacing) {
      this.fillTextWithSpacing(ctx, txt, writeX, writeY, spacing);
    } else {
      ctx.fillText(txt, writeX, writeY);
    }
  }

  private fillTextWithSpacing(ctx: any, txt: string, x: number, y: number, spacing: number) {
    // Start at position (X, Y).
    // Measure wAll, the width of the entire string using measureText()
    let wAll = ctx.measureText(txt).width;

    do {
      // Remove the first character from the string
      const char = txt.substr(0, 1);
      txt = txt.substr(1);
      let wShorter = 0;

      // Print the first character at position (X, Y) using fillText()
      ctx.fillText(char, x, y);

      // Measure wShorter, the width of the resulting shorter string using measureText().
      if (txt === '') {
        wShorter = 0;
      } else {
        wShorter = ctx.measureText(txt).width;
      }

      // Subtract the width of the shorter string from the width of the entire string,
      // giving the kerned width of the character, wChar = wAll - wShorter
      const wChar = wAll - wShorter;

      // Increment X by wChar + spacing
      x += wChar + spacing;

      // wAll = wShorter
      wAll = wShorter;

      // Repeat from step 3
    } while (txt !== '');
  }
  // eslint-disable-next-line max-lines
}
