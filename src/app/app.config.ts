import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Config } from './packages/common/config';
import { authInterceptor } from './auth-interceptor';
import { WS_HUBS } from './hubs/base-hub';
import { ThrottleHub } from './hubs/throttle-hub';
import { UnitHub } from './hubs/unit-hub';
import { InfoHub } from './hubs/info-hub';

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
      {
        provide: WS_HUBS,
        useExisting: ThrottleHub,
        multi: true,
      },
      {
        provide: WS_HUBS,
        useExisting: UnitHub,
        multi: true,
      },
      {
        provide: WS_HUBS,
        useExisting: InfoHub,
        multi: true,
      },
    ],
  };
};
