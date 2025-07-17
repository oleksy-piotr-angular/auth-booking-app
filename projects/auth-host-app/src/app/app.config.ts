import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { HOST_ROUTES } from './host.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(HOST_ROUTES), provideAnimations()],
};
