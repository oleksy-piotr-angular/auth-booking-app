// projects/_shell-app/src/app/host.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { unauthGuard } from './guards/unauth/unauth.guard';
import { authGuard } from './guards/auth/auth.guard';

export const HOST_ROUTES: Routes = [
  // Redirect root URL to profile
  { path: '', redirectTo: 'auth-mfe', pathMatch: 'full' },

  // Public routes Lazy-loaded routes for micro frontends (only for unauthenticated users)
  {
    path: 'auth-mfe',
    canActivate: [unauthGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './routes',
      }).then((m) => m.AUTH_ROUTES),
  },

  // Lazy-loaded routes for micro frontends
  {
    path: 'details-mfe',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './routes',
      }).then((m) => m.DETAILS_ROUTES),
  },
  {
    path: 'search-mfe',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './searchRoutes',
      }).then((m) => m.SEARCH_ROUTES),
  },
];
