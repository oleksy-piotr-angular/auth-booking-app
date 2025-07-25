import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { unauthGuard } from './guards/unauth/unauth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { resetTokenGuard } from './guards/reset-token/reset-token.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';

export const AUTH_ROUTES: Routes = [
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
];
