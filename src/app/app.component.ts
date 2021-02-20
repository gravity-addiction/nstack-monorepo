import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ChildActivationEnd, NavigationStart, Router } from '@angular/router';
import { ConfigService } from '@modules/app-config/config.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { TokenService } from '@modules/auth/services/token.service';
import { CookieService } from 'ngx-cookie-service';
import { filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  newVersion!: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private configService: ConfigService,
    private cookieService: CookieService,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private titleService: Title,
    private tokenService: TokenService
  ) {
   // this.cookieService.set('cookieSupport', 'true', new Date(new Date().setFullYear(new Date().getFullYear() + 2)), '/');

    // Check Logout
    this.router.events
      .pipe(
        tap(async (event) => {
          if (event instanceof NavigationStart && ((event as NavigationStart).url || '').search('logout') > -1) {
            // console.log('Doing Logout');
            await this.authService.deleteLogout();
            this.tokenService.removeTokens();
            this.router.navigateByUrl('/');
          }
        }),
        filter(event => event instanceof ChildActivationEnd)
      ).subscribe(event => {
          let snapshot = (event as ChildActivationEnd).snapshot;
          while (snapshot.firstChild !== null) {
              snapshot = snapshot.firstChild;
          }
          if (snapshot.data.title) {
            this.titleService.setTitle(snapshot.data.title);
          }
      });

    // User Auth Login
    this.route.queryParams.pipe(
      filter(v => (v && v.hasOwnProperty('ak') && v.ak !== null)),
      tap(v => {
        const paramObj = Object.assign({}, v);
        paramObj.ak = null;
        this.location.replaceState(
          this.router.createUrlTree(
            this.route.snapshot.url,
            { queryParams: paramObj }
          ).toString()
        );
      }),
      switchMap(v => this.http.post<any>(this.configService.apiPath + '/authenticate', { ak: v.ak }, { observe: 'response' })),
      tap((resp) => {
        if (this.tokenService.hasActiveToken()) {
          this.authService.authSource.next(this.tokenService.getActiveToken());
        }
      })
    ).subscribe();

  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
}
