//projects/_shell-app/testing/test-helpers.ts
import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

/**
 * Locate a stub/directive in the fixture, fail early with context,
 * and return its componentInstance typed as T.
 */
export function getStub<T, C = any>(
  fixture: ComponentFixture<C>,
  stubType: Type<T>,
  context: string
): T {
  const debugEl = fixture.debugElement.query(By.directive(stubType));
  expect(debugEl).withContext(context).not.toBeNull();
  return debugEl!.componentInstance as T;
}
