import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { parseCookie } from 'cookie';
import { inject } from '@angular/core';
import { AppService } from '../../app-service';

export const isLoggedIn = () => {
  const data = parseCookie(document.cookie);

  return data['.AspNetCore.Identity.Application'] != null;
};

export const canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const appService = inject(AppService);

  if (route.data['inverseAuthGuard']) {
    return !appService.$isLoggedIn();
  }

  return appService.$isLoggedIn();
};
