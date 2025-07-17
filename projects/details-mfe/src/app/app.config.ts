import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { DETAILS_ROUTES } from './details.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(DETAILS_ROUTES), provideAnimations()],
};
