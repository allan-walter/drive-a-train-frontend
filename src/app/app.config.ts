import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Config } from './packages/common/config';
import { authInterceptor } from './auth-interceptor';

export const getConfig = (config: Config): ApplicationConfig => {
  return {
    providers: [
      {
        provide: Config,
        useValue: config,
      },
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor])),
    ],
  };
};
