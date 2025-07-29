// projects/_shell-app/src/app/guards/unauth/unauth.guard.spec.ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { unauthGuard } from './unauth.guard';
import { Router } from '@angular/router';
import {
  createRouterSpy,
  provideMockRouter,
  createTokenServiceSpy,
  provideMockTokenService,
} from 'testing/test-helpers';
import { runInInjectionContext } from '@angular/core';
import { TokenService } from '@booking-app/auth';

describe('unauthGuard (fn)', () => {
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

  it('allows activation when NOT authenticated', fakeAsync(() => {
    tokenSpy.getToken.and.returnValue(null);

    const result = runInInjectionContext(TestBed, () =>
      unauthGuard(null as any, null as any)
    );

    tick();
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('redirects to "/" when already authenticated', fakeAsync(() => {
    tokenSpy.getToken.and.returnValue('token.xyz');

    const result = runInInjectionContext(TestBed, () =>
      unauthGuard(null as any, null as any)
    );

    tick();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));
});
