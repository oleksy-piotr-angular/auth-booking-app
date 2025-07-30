import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AUTH_ROUTES } from './auth.routes';
import { provideHttpClient } from '@angular/common/http';
import { AUTH_API_BASE } from '@booking-app/tokens';
import { environment } from '@booking-app/environments/environment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(AUTH_ROUTES),
    provideHttpClient(),
    { provide: AUTH_API_BASE, useValue: environment.apiBase },
  ],
};
