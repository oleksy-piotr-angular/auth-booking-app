// projects/auth-mfe/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AUTH_ROUTES } from './auth.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AUTH_API_BASE } from '@booking-app/tokens';
import { environment } from '@booking-app/environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(AUTH_ROUTES),
    provideHttpClient(
      // run authInterceptor on every request
      withInterceptors([authInterceptor])
    ),
    { provide: AUTH_API_BASE, useValue: environment.apiBase },
    provideAnimations(),
  ],
};
