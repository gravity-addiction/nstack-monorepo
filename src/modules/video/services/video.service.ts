import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelperService } from '@modules/app-common/services/helper-scripts.service';
import { ConfigService } from '@modules/app-config/config.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  public isFullscreen = false;
  public allowInput = true;
  public passLocalFile: any;
  public videoHlsReady = false;
  public fullscreenEle!: any; // Set this to for default fullscreen container nativeElement

  constructor(
    private configService: ConfigService,
    private helperService: HelperService,
    private http: HttpClient
  ) {
    this.helperService.loadScript('hlsjs').then(() => {
      this.videoHlsReady = true;
    });
  }

  fullscreen(ele?: any) {
    let elem = ele;
    if (!elem && this.fullscreenEle && this.fullscreenEle.hasOwnProperty('nativeElement') &&
        this.fullscreenEle.nativeElement !== null) {
      elem = this.fullscreenEle.nativeElement;
    }
    if (!elem) {
 return;
}

    this.isFullscreen = true;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else {
      this.isFullscreen = false;
      // alert('Fullscreen not available in this browser.');
    }
  }
  exitFullscreen() {
    this.isFullscreen = false;
    try {
 (document as any).exitFullscreen();
} catch (e) { }
    try {
 (document as any).mozCancelFullScreen();
} catch (e) { }
    try {
 (document as any).webkitExitFullscreen();
} catch (e) { }
    try {
 (document as any).msExitFullscreen();
} catch (e) { }
  }

  secToTime(totalSeconds: number) {
    // Get hours from milliseconds
    const hours = totalSeconds / (60 * 60);
    const absoluteHours = Math.floor(hours);
    const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    // Get remainder from hours and convert to minutes
    const minutes = (hours - absoluteHours) * 60;
    const absoluteMinutes = Math.floor(minutes);
    const m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

    // Get remainder from minutes and convert to seconds
    const seconds = (minutes - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    return h + ':' + m + ':' + s;
  }

  msToTime(milliseconds: number) {
    // Get hours from milliseconds
    const hours = milliseconds / (1000 * 60 * 60);
    const absoluteHours = Math.floor(hours);
    const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    // Get remainder from hours and convert to minutes
    const minutes = (hours - absoluteHours) * 60;
    const absoluteMinutes = Math.floor(minutes);
    const m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

    // Get remainder from minutes and convert to seconds
    const seconds = (minutes - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    return h + ':' + m + ':' + s;
  }


}
