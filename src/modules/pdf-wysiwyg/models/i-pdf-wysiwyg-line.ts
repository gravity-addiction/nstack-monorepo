// import { IPaperworkItem } from './i-paperwork-item';
import { ToolUtils } from '../services/tool-utils.service';

export class IPdfWysiwygLine {
  public x: number; // X mouse coord
  public y: number; // Y mouse coord
  public _x: number; // X end
  public _y: number; // Y end

  public stroke: number; // ctx.lineWidth

  constructor(item: any) {
    this.x = item.x || ((item.x === 0) ? 0 : 5);
    this.y = item.y || ((item.y === 0) ? 0 : 5);
    this._x = this.x;
    this._y = this.y;

    this.stroke = item.stroke || ((item.stroke === 0) ? 0 : 3);

    ToolUtils.cleanCoords(this);
  }



  /**
   * Canvas Hooks
   */
  public draw(ctx: any, selected = false, _showInfo?: string) {
    const lineW = this.stroke || 1;
          const x = this.x;
          const y = this.y;
          const nX = this._x;
          const nY = this._y;


    if (selected) {
      ctx.strokeStyle = '#FF3333';
      ctx.fillStyle = 'rgba(255, 30, 30, 0.25)';
    } else {
      ctx.strokeStyle = '#000';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    }

/*    ctx.lineWidth = 1;
    ctx.fillRect(x, nY - this.pT, nW, nH);
    ctx.strokeRect(nX - this.pL, nY - this.pT, nW, nH);
*/
    ctx.lineWidth = lineW;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(nX, nY);
    ctx.stroke();

  }

  public hasCollision(x: number, y: number): boolean {
    const lineGradient = (this.y - this._y) / (this.x - this._x);
    // ToolUtils.pointInPolygon([x, y], [this.x, this.y, ])
    if (Math.abs(x - this.x) < 10 && Math.abs(y - this.y) < 10) {
 return true;
}
    if (Math.abs(x - this._x) < 10 && Math.abs(y - this._y) < 10) {
 return true;
}

    /*
    const halfW = (this.w / 2),
          halfH = (this.h / 2),
          lineW = this.stroke || 1,

          left = this.x - halfW - (lineW / 2),
          right = left + this.w + lineW,
          top = this.y - halfH - (lineW / 2),
          bottom = top + this.h + lineW;

    return (right >= x && left <= x && bottom >= y && top <= y);
    */
   return false;
  }



  public checkHandleTL(x: number, y: number): boolean {
    if (Math.abs(x - this.x) < 10 && Math.abs(y - this.y) < 10) {
 return true;
}
    return false;
  }
  public checkHandleBR(x: number, y: number): boolean {
    if (Math.abs(x - this._x) < 10 && Math.abs(y - this._y) < 10) {
 return true;
}
    return false;
  }

  public updateDragWhole(xDiff: number, yDiff: number): any {
    this.x += xDiff;
    this.y += yDiff;
    this._x += xDiff;
    this._y += yDiff;
  }

  public updateDragTL(x: number, y: number): any {
    this.x = x;
    this.y = y;
  }

  public updateDragBR(x: number, y: number): any {
    this._x = x;
    this._y = y;
  }

  public updateDone(x: number, y: number): void {
    if (this.x > this._x) {
      const tX = this.x;
            const tY = this.y;
      this.x = this._x;
      this.y = this._y;
      this._x = tX;
      this._y = tY;
    }
  }



  /**
   * PDF Hooks
   */
  public writePDF(doc: any, convCalc: any) {
    const fX = (((this.x * convCalc) / 96 ) * 72);
    const fY = (((this.y * convCalc) / 96 ) * 72);
    const fX1 = (((this._x * convCalc) / 96 ) * 72);
    const fY1 = (((this._y * convCalc) / 96 ) * 72);

    doc.lineWidth(this.stroke / 2);
    doc.moveTo(fX, fY).lineTo(fX1, fY1).stroke();

  }
}
