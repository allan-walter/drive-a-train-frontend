import { Routes } from '@angular/router';
import { canActivate } from './packages/common/auth';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./packages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./packages/auth/login/login-page.component').then((m) => m.LoginPage),
    canActivate: [canActivate],
    data: { inverseAuthGuard: true },
  },
  {
    path: 'video',
    loadComponent: () => import('./packages/video/video-page/video-page').then((m) => m.VideoPage),
    canActivate: [canActivate],
  },
];
