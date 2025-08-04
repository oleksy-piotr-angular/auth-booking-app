// projects/_shell-app/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { HOST_ROUTES } from './host.routes';
import { environment } from '@booking-app/environments/environment';
import { AUTH_API_BASE } from '@booking-app/tokens';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(HOST_ROUTES),
    provideAnimations(),
    provideHttpClient(
      // run authInterceptor on every request
      withInterceptors([authInterceptor])
    ),
    {
      provide: AUTH_API_BASE,
      useValue: environment.apiBase,
    },
  ],
};
