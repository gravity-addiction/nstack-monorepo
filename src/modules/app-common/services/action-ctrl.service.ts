import { Location } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

declare const document: any;

@Injectable({
  providedIn: 'root',
})
export class ActionCtrlService {
  public navLoading = true;
  public lockLoading = false;

  public showMenu = new Subject<boolean>();
  public showMenuOpened = new EventEmitter<boolean>();
  public hasBackHistory = false;

  public uniqueBacks: any = [
    //   { 'path': '/v/player', 'back': '/video' }
  ];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private _location: Location,
    private _router: Router
  ) {
    // this._location.subscribe(changed => { this.checkBackHistory(); });
    // this.checkBackHistory();
    this.subscriptions.add(
      this._router.events.pipe(
        filter(event => ((event instanceof NavigationStart) || (event instanceof NavigationEnd))),
        tap((e: any) => {
          if (e instanceof NavigationStart) {
            this.navLoading = true;
          } else if (e instanceof NavigationEnd && !this.lockLoading) {
            this.navLoading = false;
          }
        })
      ).subscribe()
    );
  }


  // BACK Services
  goHome() {
    location.href = '/';
  }

  checkBackHistory(): void {
    try {
      this.hasBackHistory = ((window as any).history.length) ? true : false;
    } catch (e) {
      const histState: any = this._location.getState();
      this.hasBackHistory = (((histState || {}).navigationId || 0) > 1);
    }
  }

  triggerWindowResize() {
    try {
      window.dispatchEvent(new Event('resize'));
    } catch (e) {
      try {
        const resizeEvent = window.document.createEvent('UIEvents');
        resizeEvent.initEvent('resize', true, false);
        window.dispatchEvent(resizeEvent);
      } catch (E) { }
    }
  }

  goBackClick(ev: Event, defaultHref: string | null = null) {
    ev.preventDefault();

    try {
      (window as any).history.back();
    } catch (e) {
      const urlPath = this._router.url.substring(0, this._router.url.indexOf('?'));
      const histState: any = this._location.getState();

      if (((histState || {}).navigationId || 0) > 1) {
        this._location.back();
      } else {
        const prePath = urlPath.substring(0, this._router.url.indexOf('/'));
        if (defaultHref) {
          try {
            this._router.navigateByUrl(defaultHref);
            return;
          } catch (err) { }
        }

        const uBacks = this.uniqueBacks.length;
        for (let u = 0; u < uBacks; u++) {
          if (this.uniqueBacks[u].path.toLocaleLowerCase() === urlPath.toLocaleLowerCase()) {
            try {
              this._router.navigateByUrl(this.uniqueBacks[u].back);
              return;
            } catch (err) { }
          }
        }

        try {
          this._router.navigate([(prePath || '/')]);
          return;
        } catch (err) { }

        this._router.navigate(['/']);
      }
    }
  }
}
