import { Injectable, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideoCanvasService implements OnDestroy {
  private flashTimeout$: any;

  constructor() { }

  ngOnDestroy() {
    try {
      clearTimeout(this.flashTimeout$);
    } catch (e) { }
  }

  writeScore(ctx: CanvasRenderingContext2D, score: string, color = 'green') {
    ctx.font = '20px Arial';
    ctx.clearRect(0, 0, 65, 22);
    ctx.fillStyle = color;
    ctx.fillText(score, 2, 16);
  }

  /*
    video_flash(color = 'red', timeout = 50) {
      if (color === 'red') {
        this.videoCanvas.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
      }
      this.flashTimeout$ = setTimeout(() => {
        this.videoCanvas.style.backgroundColor = '';
      }, timeout);
    }
  */
}
