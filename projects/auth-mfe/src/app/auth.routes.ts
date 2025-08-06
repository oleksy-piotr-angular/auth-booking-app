import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { unauthGuard } from './guards/unauth/unauth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { resetTokenGuard } from './guards/reset-token/reset-token.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth/auth.guard';
import { AuthPageNotFoundComponent } from './pages/auth-page-not-found/auth-page-not-found.component';
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    canActivate: [unauthGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [resetTokenGuard],
      },
    ],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', component: AuthPageNotFoundComponent },
];
