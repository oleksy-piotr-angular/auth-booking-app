import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  setToken(token: string): void {}
  getToken(): string | null {
    return null;
  }
  clearToken(): void {}
}
