// import { IPaperworkItem } from './i-paperwork-item';
import { ToolUtils } from '../services/tool-utils.service';

export class IPdfWysiwygEllipse {
  public x: number; // X mouse coord
  public y: number; // Y mouse coord
  public h: number; // Item Height
  public w: number; // Item Width

  public stroke: number; // ctx.lineWidth

  constructor(item: any) {
    this.x = item.x || ((item.x === 0) ? 0 : 5);
    this.y = item.y || ((item.y === 0) ? 0 : 5);
    this.w = item.w || ((item.w === 0) ? 0 : 300);
    this.h = item.h || ((item.h === 0) ? 0 : 35);

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
          const w = this.w;
          const h = this.h
    ;

    if (selected) {
      ctx.strokeStyle = '#FF3333';
      ctx.fillStyle = 'rgba(255, 30, 30, 0.25)';
    } else {
      ctx.strokeStyle = '#33FF33';
      ctx.fillStyle = 'rgba(30, 255, 30, 0.25)';
    }

    ctx.lineWidth = lineW;
    this.drawEllipse(ctx, x, y, w, h);
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
  public writePDF(_doc: any, _convCalc: any) {

  }




  /**
   * Private Class Functions
   */
  // private drawEllipseByCenter(ctx, cx, cy, w, h) {
  //   this.drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
  // }

  private drawEllipse(ctx: any, x: number, y: number, w: number, h: number) {
    const kappa = .5522848;
        const ox = (w / 2) * kappa; // control point offset horizontal
        const oy = (h / 2) * kappa; // control point offset vertical
        const xe = x + w;           // x-end
        const ye = y + h;           // y-end
        const xm = x + w / 2;       // x-middle
        const ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    // ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.stroke();
  }
}
