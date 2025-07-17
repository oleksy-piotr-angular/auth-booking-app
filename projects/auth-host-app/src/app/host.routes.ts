import { DETAILS_ROUTES } from './../../../details-mfe/src/app/details.routes';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const HOST_ROUTES: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'details-mfe',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './routes',
      }).then((m) => m.DETAILS_ROUTES),
  },
  {
    path: 'search-mfe',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './searchRoutes',
      }).then((m) => m.SEARCH_ROUTES),
  },
];
