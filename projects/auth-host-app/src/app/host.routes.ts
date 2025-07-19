// projects/auth-host-app/src/app/host.routes.ts
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { LoginComponent } from './pages/login/login.component';
import { unauthGuard } from './guards/unauth/unauth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { resetTokenGuard } from './guards/reset-token/reset-token.guard';

export const HOST_ROUTES: Routes = [
  // Redirect root URL to profile
  { path: '', redirectTo: 'profile', pathMatch: 'full' },

  // Public routes (only for unauthenticated users)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthGuard],
  },

  // Public routes (only for unauthenticated users)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [unauthGuard, resetTokenGuard],
  },

  // Protected route
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },

  // Lazy-loaded routes for micro frontends
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
