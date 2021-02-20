import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  public screenWidth = 1024;
  public screenHeight = 800;
  public largeWidth = 1024;
  public screenOrientation = 'landscape';
  public screenChanged: Observable<any>;

  constructor() {
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(debounceTime(200)).pipe(map(this.setWidths));
    this.screenChanged = screenSizeChanged$.pipe(startWith(this.setWidths()));
  }

  getNavigationBarSize() {
    return 0;
  }

  getAppUsableScreenSize() {
    return { x: document.body.offsetWidth, y: document.body.offsetHeight };
  }

  getRealScreenSize() {
    return { x: document.body.offsetWidth, y: document.body.offsetHeight };
  }

  setWidths() {
    this.screenWidth = (
      (window as any || {}).screen || {}).innerWidth ||
      ((document || {}).body || {}).offsetWidth ||
      ((window as any || {}).screen || {}).width ||
      -1;
    this.screenHeight = ((window as any || {}).screen || {}).innerHeight ||
      ((document || {}).body || {}).offsetHeight ||
      ((window as any || {}).screen || {}).height ||
      -1;
    this.largeWidth = (this.screenWidth > this.screenHeight) ? this.screenWidth : this.screenHeight;
    this.screenOrientation = (this.screenWidth > this.screenHeight) ? 'landscape' : 'portrait';
    return this.screenOrientation;
  }
}
