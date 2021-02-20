/* tslint:disable: ordered-imports*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Module */
import { BlogModule } from './blog.module';

/* Containers */
import * as blogContainers from './containers/index';

/* Guards */
import * as blogGuards from './guards/index';

/* Routes */
export const ROUTES: Routes = [
    {
        path: '',
        component: blogContainers.HomeComponent,
    },
    {
        path: 'blog/:post/edit',
        component: blogContainers.EditPostComponent,
    },
    {
        path: 'blog/:post',
        canActivate: [blogGuards.PostGuard],
        component: blogContainers.PostComponent,
    },
];

@NgModule({
    imports: [BlogModule, RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class BlogRoutingModule {}
