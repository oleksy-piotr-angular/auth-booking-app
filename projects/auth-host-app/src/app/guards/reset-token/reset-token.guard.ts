import { CanActivateFn } from '@angular/router';

export const resetTokenGuard: CanActivateFn = (route, state) => {
  return false;
};
