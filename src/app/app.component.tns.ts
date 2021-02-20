import { Component, OnInit, ViewChild } from '@angular/core';
import { NSRouteReuseStrategy, RouterExtensions } from '@nativescript/angular';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  newVersion!: string;

  constructor(
    private _router: RouterExtensions,
    private _routerReuse: NSRouteReuseStrategy
  ) {

  }

  ngOnInit() {
    this._routerReuse.shouldReuseRoute = () => false;
  }

  runRefresh() {
    this._router.navigateByUrl(this.newVersion);
  }
}
