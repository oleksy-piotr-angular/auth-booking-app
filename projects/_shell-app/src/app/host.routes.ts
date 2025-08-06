// projects/_shell-app/src/app/host.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { authGuard } from './guards/auth/auth.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const HOST_ROUTES: Routes = [
  // Root lands on the login page
  { path: '', component: HomePageComponent, pathMatch: 'full' },

  // Top-level aliases for auth-related paths
  { path: 'login', redirectTo: 'auth-mfe/login', pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth-mfe/register', pathMatch: 'full' },
  {
    path: 'forgot-password',
    redirectTo: 'auth-mfe/forgot-password',
    pathMatch: 'full',
  },
  {
    path: 'reset-password',
    redirectTo: 'auth-mfe/reset-password',
    pathMatch: 'full',
  },
  { path: 'profile', redirectTo: 'auth-mfe/profile', pathMatch: 'full' },

  // Public routes Lazy-loaded routes for micro frontends (only for unauthenticated users)
  // Delegate **all** /auth-mfe/* URLs to Auth MFE
  {
    path: 'auth-mfe',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4203/remoteEntry.js',
        exposedModule: './authRoutes',
      }).then((m) => m.AUTH_ROUTES),
  },

  // Lazy-loaded routes for micro frontends
  {
    path: 'details-mfe/:detailId',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './detailsRoutes',
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
  { path: '**', component: PageNotFoundComponent },
];
