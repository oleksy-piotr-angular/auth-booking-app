// projects/auth-host-app/src/app/guards/reset-token/reset-token.guard.spec.ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { runInInjectionContext } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  convertToParamMap,
} from '@angular/router';

import { resetTokenGuard } from './reset-token.guard';
import {
  createRouterSpy,
  provideMockRouter,
} from 'projects/auth-host-app/testing/test-helpers';

describe('resetTokenGuard (fn)', () => {
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = createRouterSpy();
    TestBed.configureTestingModule({
      providers: [provideMockRouter(routerSpy)],
    });
  });

  it('allows activation when token query-param is present', fakeAsync(() => {
    const route = {
      queryParamMap: convertToParamMap({ token: 'valid-token-123' }),
    } as ActivatedRouteSnapshot;

    const result = runInInjectionContext(TestBed, () =>
      resetTokenGuard(route, null as any)
    );
    tick();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('redirects to /login when token query-param is missing', fakeAsync(() => {
    const route = {
      queryParamMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;

    const result = runInInjectionContext(TestBed, () =>
      resetTokenGuard(route, null as any)
    );
    tick();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  }));
});
