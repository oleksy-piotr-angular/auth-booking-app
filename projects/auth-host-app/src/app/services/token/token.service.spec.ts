// projects/auth-host-app/src/app/services/token/token.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';

describe('TokenService (TDD)', () => {
  let service: TokenService;
  const TOKEN_KEY = 'auth_token';

  const now = Math.floor(Date.now() / 1000);
  const future = now + 3600;
  const past = now - 3600;
  function makeToken(payload: any): string {
    return `h.${btoa(JSON.stringify(payload))}.s`;
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [TokenService] });
    service = TestBed.inject(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve a simple token', () => {
    service.setToken('abc123');
    expect(service.getToken()).toBe('abc123');
    expect(localStorage.getItem(TOKEN_KEY)).toBe('abc123');
  });

  it('should clear the token', () => {
    service.setToken('to-remove');
    service.clearToken();
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should return a valid (non-expired) JWT', () => {
    const token = makeToken({ exp: future });
    service.setToken(token);
    expect(service.getToken()).toBe(token);
  });

  it('should clear and return null if the JWT is expired', () => {
    const expired = makeToken({ exp: past });
    localStorage.setItem(TOKEN_KEY, expired);

    const result = service.getToken();
    expect(result).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should return null for malformed tokens', () => {
    localStorage.setItem(TOKEN_KEY, 'not.a.valid.token');
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('should return null if exp is missing in JWT', () => {
    const noExp = makeToken({ foo: 'bar' });
    service.setToken(noExp);
    expect(service.getToken()).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});
