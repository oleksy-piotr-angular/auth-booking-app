//projects/auth-host-app/testing/test-helpers.ts
import { Router } from '@angular/router';
import { AuthService, TokenService } from '@booking-app/auth';

export function createRouterSpy() {
  return jasmine.createSpyObj<Router>('Router', ['navigate']);
}

export function provideMockRouter(routerSpy?: jasmine.SpyObj<Router>) {
  return {
    provide: Router,
    useValue: routerSpy || createRouterSpy(),
  };
}

export function createAuthServiceSpy() {
  // now spies on both login() and register()
  return jasmine.createSpyObj<AuthService>('AuthService', [
    'login',
    'register',
  ]);
}

export function provideMockAuthService(authSpy?: jasmine.SpyObj<AuthService>) {
  return {
    provide: AuthService,
    useValue: authSpy || createAuthServiceSpy(),
  };
}

export function createTokenServiceSpy() {
  return jasmine.createSpyObj<TokenService>('TokenService', ['getToken']);
}

export function provideMockTokenService(
  tokenSpy?: jasmine.SpyObj<TokenService>
) {
  return {
    provide: TokenService,
    useValue: tokenSpy || createTokenServiceSpy(),
  };
}
