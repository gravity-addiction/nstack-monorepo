import { Routes } from '@angular/router';
import { ChangePasswordComponent, LoginComponent } from '@modules/users/components/index';

import { AuthGuard }from '@modules/auth/guards/auth.guard';
import { AuthAdminGuard }from '@modules/auth/guards/auth-admin.guard';

export const routes: Routes = [
  {
      path: '',
      loadChildren: () =>
        import('../modules/home/home-routing.module').then(m => m.HomeRoutingModule),
    },
    /*
    {
      path: '',
      redirectTo: '/login',
      pathMatch: 'full',
    },*/
    {
      path: 'changepassword',
      component: ChangePasswordComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'login',
      component: LoginComponent,
      data: { title: 'Pages Login - Skydive Or Bust' },
    },
    {
      path: 'logout',
      redirectTo: '/?logout',
      pathMatch: 'full',
    },
    {
      path: 'd',
      loadChildren: () =>
        import('@modules/pdf-draw/pdf-draw-routing.module').then(m => m.PdfDrawRoutingModule),
    },
    {
      path: 'e',
      loadChildren: () =>
        import('@modules/events/events-routing.module').then(m => m.EventsRoutingModule),
    },
    {
      path: 'eadmin',
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('@modules/events-admin/events-admin-routing.module').then(m => m.EventsAdminRoutingModule),
    },
    {
      path: 'eiframe',
      loadChildren: () =>
        import('@modules/events-iframe/events-iframe-routing.module').then(m => m.EventsIframeRoutingModule),
    },
    {
      path: 'r',
      loadChildren: () =>
        import('@modules/records/records-routing.module').then(m => m.RecordsRoutingModule),
    },
    {
      path: 'p',
      loadChildren: () =>
        import('@modules/profiles/profiles-routing.module').then(m => m.ProfilesRoutingModule),
    },
    {
      path: 'admin/u',
      canActivate: [AuthAdminGuard],
      loadChildren: () =>
        import('@modules/users/users-routing.module').then(m => m.UsersRoutingModule),
    },
    {
      path: 'admin/aws',
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('@modules/aws/aws-routing.module').then(m => m.AwsRoutingModule),
    },
    {
      path: 'v',
      loadChildren: () =>
      import('@modules/video/video-routing.module').then(m => m.VideoRoutingModule),
    },
/*
    {
      path: 'auth',
      loadChildren: () =>
        import('@modules/auth/auth-routing.module').then(m => m.AuthRoutingModule),
    },
*/
    {
      path: 'error',
      loadChildren: () =>
        import('@modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
    },
    {
      path: '**',
      pathMatch: 'full',
      loadChildren: () =>
        import('@modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
    },
];
