// projects/auth-host-app/src/app/services/token/token.service.ts

import { Injectable } from '@angular/core';
import { isTokenExpired } from '../../shared/utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly key = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.key, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.key);
    if (!token) {
      return null;
    }

    const parts = token.split('.');

    if (parts.length === 1) {
      // Simple opaque token
      return token;
    }

    if (parts.length === 3) {
      // Proper JWT ⇒ validate expiry
      if (isTokenExpired(token)) {
        this.clearToken();
        return null;
      }
      return token;
    }

    // Anything else is malformed
    this.clearToken();
    return null;
  }

  clearToken(): void {
    localStorage.removeItem(this.key);
  }
}
