import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';

/* Module */
import { HomeModule } from './home.module';

/* Routes */
import { homeRoutes } from './home.routes';

@NgModule({
  imports: [
    HomeModule.forRoot(),
    NativeScriptRouterModule.forChild(homeRoutes)
  ],
  exports: [ NativeScriptRouterModule ]
})
export class HomeRoutingModule { }
