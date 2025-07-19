// projects/auth-host-app/src/app/guards/unauth/unauth.guard.ts

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TokenService } from '../../services/token/token.service';

export const unauthGuard: CanActivateFn = () => {
  const token = inject(TokenService).getToken();
  const router = inject(Router);

  if (!token) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
