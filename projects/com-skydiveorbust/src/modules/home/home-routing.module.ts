
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/* Module */
import { HomeModule } from './home.module';

/* Routes */
import { homeRoutes } from './home.routes';

@NgModule({
  imports: [
    HomeModule.forRoot(),
    RouterModule.forChild(homeRoutes)
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
