import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '@booking-app/auth';

export const authGuard: CanActivateFn = () => {
  const token = inject(TokenService).getToken();
  const router = inject(Router);

  if (!token) {
    router.navigate(['auth-mfe']);
    return false;
  }

  return true;
};
