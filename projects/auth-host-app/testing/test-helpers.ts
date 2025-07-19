import { Router } from '@angular/router';
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

export function createTokenServiceSpy() {
  return jasmine.createSpyObj<TokenService>('TokenService', ['getToken']);
}

export function provideMockAuthService(
  tokenSpy?: jasmine.SpyObj<TokenService>
) {
  return {
    provide: TokenService,
    useValue: tokenSpy || createTokenServiceSpy(),
  };
}
