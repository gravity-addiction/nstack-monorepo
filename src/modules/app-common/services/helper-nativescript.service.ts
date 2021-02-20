/* Code from https://github.com/JoshDSommer/nativescript-swiss-army-knife */
import { Injectable } from '@angular/core';
import { ListView, ScrollView, isAndroid, isIOS } from '@nativescript/core';
import { android as androidApp, ios as iosApp } from '@nativescript/core/application';
import { Color } from '@nativescript/core/color';
import { ad } from '@nativescript/core/utils';

@Injectable({
  providedIn: 'root',
})
export class HelperNativescriptService {
  get android(): any {
    return;
  }
  get ios(): any {
    return;
  }

  disableScrollBounce(view: ScrollView | ListView): void {
    // no ui bounce. causes problems
    if (isIOS) {
      view.ios.bounces = false;
    } else if (isAndroid && view.android != null) {
      view.android.setOverScrollMode(2);
    }
  }


  dismissSoftKeyboard() {
    if (isAndroid) {
      ad.dismissSoftInput();
      /*
      const inputManager = this._androidContext().getSystemService(
        this.android.content.Context.INPUT_METHOD_SERVICE
      );
      const currentFocus = this._androidActivity().getCurrentFocus() as android.view.View;
      if (currentFocus) {
        const windowToken = currentFocus.getWindowToken();
        if (windowToken) {
          inputManager.hideSoftInputFromWindow(
            windowToken,
            this.android.view.inputmethod.InputMethodManager.HIDE_NOT_ALWAYS
          );
        }
      }
      */
    } else if (isIOS) {
      iosApp.nativeApp.sendActionToFromForEvent('resignFirstResponder', null, null, null);
    }
  }

  removeHorizontalScrollBars(view: ScrollView | ListView): void {
    if (isIOS) {
      view.ios.showsHorizontalScrollIndicator = false;
    } else if (isAndroid) {
      view.android.setHorizontalScrollBarEnabled(false);
    }
  }

  removeVerticalScrollBars(view: ScrollView | ListView): void {
    if (isIOS) {
      view.ios.showsVerticalScrollIndicator = false;
    } else if (isAndroid) {
      view.android.setVerticalScrollBarEnabled(false);
    }
  }

  _getStatusBarHeight(): number {
    if (isAndroid) {
      let result = 0;
      const resourceId = this._androidContext()
        .getResources()
        .getIdentifier('status_bar_height', 'dimen', 'android');
      if (resourceId > 0) {
        result = this._androidContext()
          .getResources()
          .getDimensionPixelSize(resourceId);
        result =
          result /
          this._androidContext()
            .getResources()
            .getDisplayMetrics().density;
      }
      return result;
    } else {
      return 0;
    }
  }

  _getBarColor(color: string | Color): Color {
    let barColor: Color;

    if (color instanceof Color === false) {
      barColor = new Color(color as string);
    } else {
      barColor = color as Color;
    }
    return barColor;
  }

  _getNavBarHeight(): number {
    if (isAndroid) {
      let result = 0;
      const resourceId = this._androidContext()
        .getResources()
        .getIdentifier('navigation_bar_height', 'dimen', 'android');
      if (resourceId > 0) {
        result = this._androidContext()
          .getResources()
          .getDimensionPixelSize(resourceId);
        result =
          result /
          this._androidContext()
            .getResources()
            .getDisplayMetrics().density;
      }
      return result;
    } else {
      return 0;
    }
  }

  _androidContext() {
    return androidApp.context;
  }

  _androidActivity() {
    return androidApp.foregroundActivity || androidApp.startActivity;
  }



}
