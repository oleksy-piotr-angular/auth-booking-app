// projects/_shell-app/src/app/guards/reset-token/reset-token.guard.ts

import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

export const resetTokenGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const token = route.queryParamMap.get('token');

  if (!token) {
    router.navigate(['login']);
    return false;
  }

  return true;
};
