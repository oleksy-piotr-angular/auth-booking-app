import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AUTH_ROUTES } from './auth.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(AUTH_ROUTES)],
};
