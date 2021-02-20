import { Injectable } from '@angular/core';
import { on as appOn, orientationChangedEvent, OrientationChangedEventData } from '@nativescript/core/application';
import { Screen } from '@nativescript/core';
import { Subject } from 'rxjs';

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
    return 0;
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
