import { Injectable } from '@angular/core';
// eslint-disable-next-line max-len
import { on as appOn, off as appOff, android as appAndroid, orientationChangedEvent, OrientationChangedEventData } from '@nativescript/core/application';
import { Screen } from '@nativescript/core';

import { Subject } from 'rxjs';

declare let android: any;

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  public screenWidth = 300;
  public screenHeight = 600;
  public largeWidth = 600;
  public screenOrientation = 'portrait';
  public screenChanged = new Subject<string>();

  constructor() {
    appOn(orientationChangedEvent, this.changedOrientation);

    if (Screen.mainScreen.widthDIPs > Screen.mainScreen.heightDIPs) {
      this.screenOrientation = 'landscape';
    } else {
      this.screenOrientation = 'portrait';
    }

    this.setWidths();
  }

  getNavigationBarSize() {
    const context = android.context;
    const appUsableSize = this.getAppUsableScreenSize();
    const realScreenSize = this.getRealScreenSize();

    // navigation bar on the right
    // I dont care about right nav bar, so i return 0
    if (appUsableSize.x < realScreenSize.x) {
      return realScreenSize.x - appUsableSize.x; // new android.graphics.Point(realScreenSize.x - appUsableSize.x, appUsableSize.y);
    }

    // navigation bar at the bottom
    if (appUsableSize.y < realScreenSize.y) {
      return realScreenSize.y - appUsableSize.y; //new android.graphics.Point(appUsableSize.x, realScreenSize.y - appUsableSize.y);
    }

    // navigation bar is not present
    return 0; //new android.graphics.Point();
  }

  getAppUsableScreenSize() {
    const context = appAndroid.context;
    const windowManager = context.getSystemService(android.content.Context.WINDOW_SERVICE);
    const display = windowManager.getDefaultDisplay();
    const size = new android.graphics.Point();
    display.getSize(size);
    return size;
  }

  getRealScreenSize() {
    const context = appAndroid.context;
    const windowManager = context.getSystemService(android.content.Context.WINDOW_SERVICE);
    const display = windowManager.getDefaultDisplay();
    const size = new android.graphics.Point();

    if (android.os.Build.VERSION.SDK_INT >= 17) {
      display.getRealSize(size);
    } else if (android.os.Build.VERSION.SDK_INT >= 14) {
      try {
        size.x = android.view.Display.class.getMethod('getRawWidth').invoke(display);
        size.y = android.view.Display.class.getMethod('getRawHeight').invoke(display);
      } catch (e) {
        // console.log(e);
        // console.log(e.stack);
      }
    }
    return size;
  }

  changedOrientation = (data: OrientationChangedEventData) => {
    // console.log('Setting Orientation: Old', this.screenOrientation, 'New', data.newValue);
    this.screenOrientation = data.newValue || 'portrait';
    setTimeout(() => {
      this.setWidths();
    }, 100);
  };

  setWidths() {
    // console.log('Setting Widths Service', this.screenOrientation, Screen.mainScreen.widthDIPs, Screen.mainScreen.heightDIPs);

    this.screenWidth = Screen.mainScreen.widthDIPs - (
      (this.screenOrientation === 'landscape') ?
        (this.getNavigationBarSize() / Screen.mainScreen.scale) : 0
    );
    this.screenHeight = Screen.mainScreen.heightDIPs - (
      (this.screenOrientation === 'portrait') ?
        (this.getNavigationBarSize() / Screen.mainScreen.scale) : 0
    );
    this.largeWidth = (this.screenWidth > this.screenHeight) ? this.screenWidth : this.screenHeight;
    // console.log('Setup Widths To Service', this.largeWidth, this.screenWidth, 'x', this.screenHeight);
    this.screenChanged.next(this.screenOrientation);
  }


}
