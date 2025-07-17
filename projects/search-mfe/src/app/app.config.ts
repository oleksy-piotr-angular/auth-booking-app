import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { SEARCH_ROUTES } from './search.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(SEARCH_ROUTES), provideAnimations()],
};
