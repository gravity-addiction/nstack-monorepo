import { Routes } from '@angular/router';

/* Containers */
import * as homeContainers from './containers/index';

export const homeRoutes: Routes = [
  {
    path: '',
    component: homeContainers.HomeComponent,
  },
  {
    path: 'about',
    component: homeContainers.AboutComponent,
  }
];
