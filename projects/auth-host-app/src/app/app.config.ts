// projects/auth-host-app/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HOST_ROUTES } from './host.routes';
import { environment } from '@booking-app/environments/environment';
import { AUTH_API_BASE } from '@booking-app/tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(HOST_ROUTES),
    provideAnimations(),
    {
      provide: AUTH_API_BASE,
      useValue: environment.apiBase,
    },
  ],
};
