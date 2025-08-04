// projects/details-mfe/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { DETAILS_ROUTES } from './details.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(DETAILS_ROUTES),
    provideAnimations(),
    provideHttpClient(),
  ],
};
