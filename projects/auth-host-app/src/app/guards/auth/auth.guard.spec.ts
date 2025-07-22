import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { authGuard } from './auth.guard';

import {
  createRouterSpy,
  provideMockRouter,
  createTokenServiceSpy,
  provideMockTokenService,
} from 'projects/auth-host-app/testing/test-helpers';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { runInInjectionContext } from '@angular/core';

describe('authGuard (fn)', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let tokenSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    routerSpy = createRouterSpy();
    tokenSpy = createTokenServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        provideMockRouter(routerSpy),
        provideMockTokenService(tokenSpy),
      ],
    });
  });

  it('redirects to /login when NOT authenticated', fakeAsync(() => {
    tokenSpy.getToken.and.returnValue(null);

    const result = runInInjectionContext(TestBed, () =>
      authGuard(null as any, null as any)
    );

    tick();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  }));

  it('allows activation when authenticated', fakeAsync(() => {
    tokenSpy.getToken.and.returnValue('token.abc');

    const result = runInInjectionContext(TestBed, () =>
      authGuard(null as any, null as any)
    );

    tick();
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
