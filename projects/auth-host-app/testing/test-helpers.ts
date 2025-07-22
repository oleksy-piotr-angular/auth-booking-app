import { Router } from '@angular/router';
import { AuthService } from '../src/app/services/auth/auth.service';
import { TokenService } from '../src/app/services/token/token.service';

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
  return jasmine.createSpyObj<AuthService>('AuthService', ['login']);
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
