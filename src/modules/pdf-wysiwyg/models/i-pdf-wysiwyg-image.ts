// import { IPaperworkItem } from './i-paperwork-item';
import { ToolUtils } from '../services/tool-utils.service';

export class IPdfWysiwygImage {
  public x: number; // X mouse coord
  public y: number; // Y mouse coord
  public h: number; // Item Height
  public w: number; // Item Width
  public dataUrl: string;
  public dataImage: any;
  public constrain: boolean;
  public dataBase64Url: string;

  constructor(item: any) {
    this.x = item.x || ((item.x === 0) ? 0 : 5);
    this.y = item.y || ((item.y === 0) ? 0 : 5);
    this.w = item.w || ((item.w === 0) ? 0 : null);
    this.h = item.h || ((item.h === 0) ? 0 : null);
    this.dataUrl = item.dataUrl || '';
    this.dataImage = item.dataImage || null;
    this.dataBase64Url = item.dataBase64Url || '';
    this.constrain = item.constrain || true;

    ToolUtils.cleanCoords(this);
  }



  /**
   * Canvas Hooks
   */
  public draw(ctx: any, selected = false, _showInfo?: string) {
    if (!this.dataImage) {
      this.dataImage = new Image();
      this.dataImage.onload = () => {
        const cV = document.createElement('canvas');
        cV.width = this.dataImage.width;
        cV.height = this.dataImage.height;
        if (!this.w && this.h) {
          const origRatio = this.dataImage.width / this.dataImage.height;
          this.w = this.h * origRatio;
        }
        if (!this.h && this.w) {
          const origRatio = this.dataImage.height / this.dataImage.width;
          this.h = this.w * origRatio;
        }
        this.drawDataImage(ctx);
        const cvX = cV.getContext('2d');
        if (!cvX) {
 return;
}
        cvX.drawImage(this.dataImage, 0, 0);
        this.dataBase64Url = cV.toDataURL('image/png');

      };
      this.dataImage.src = this.dataUrl;
    } else {
      this.drawDataImage(ctx);
    }

    if (selected) {
      ctx.strokeStyle = '#FF3333';
      ctx.fillStyle = 'transparent';
    } else {
      ctx.strokeStyle = 'transparent';
      ctx.fillStyle = 'transparent';
    }

    ctx.lineWidth = 1;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeRect(this.x, this.y, this.w, this.h);

  }

  public drawDataImage(ctx: any) {
    const x = this.x;
          const y = this.y;
          const h = this.h;
          const w = this.w;
    ctx.drawImage(this.dataImage, x, y, this.w, this.h);
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

  public gcd(a: number, b: number): number {
    if (a < 0) {
 a = -a;
}
    if (b < 0) {
 b = -b;
}
    if (Number.isInteger(a) && Number.isInteger(b) && !(a === 0 && b === 0)) {
      if (!b) {
 return a;
}
      return this.gcd(b, a % b);
    }
    return 0;
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
    const origRatio = this.w / this.h;
    this.w = Math.abs(this.x - x);
    this.h = Math.abs(this.y - y);
  }



  /**
   * PDF Hooks
   */
  public writePDF(doc: any, convCalc: any) {
    return new Promise((resolve) => {
      const fX = (((this.x * convCalc) / 96 ) * 72);
      const fY = (((this.y * convCalc) / 96 ) * 72);
      const fW = (((this.w * convCalc) / 96 ) * 72);
      const fH = (((this.h * convCalc) / 96 ) * 72);

      if (!this.dataBase64Url) {
        this.dataImage = new Image();
        this.dataImage.onload = () => {
          const cV = document.createElement('canvas');
          cV.width = this.dataImage.width;
          cV.height = this.dataImage.height;
          if (!this.w && this.h) {
            const origRatio = this.dataImage.width / this.dataImage.height;
            this.w = this.h * origRatio;
          }
          if (!this.h && this.w) {
            const origRatio = this.dataImage.height / this.dataImage.width;
            this.h = this.w * origRatio;
          }
          const cvX = cV.getContext('2d');
          if (!cvX) {
 return;
}
          cvX.drawImage(this.dataImage, 0, 0);
          this.dataBase64Url = cV.toDataURL('image/png');
          doc.image(this.dataBase64Url, fX, fY, { width: fW, height: fH });
          resolve(true);
        };
        this.dataImage.src = this.dataUrl;
      } else {
        doc.image(this.dataBase64Url, fX, fY, { width: fW, height: fH });
        resolve(true);
      }
    });
  }
}
