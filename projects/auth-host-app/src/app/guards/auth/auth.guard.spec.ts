// projects/auth-host-app/src/app/guards/auth.guard.spec.ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { TokenService } from '../../services/token/token.service';

describe('authGuard (fn)', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let tokenSpy: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    tokenSpy = jasmine.createSpyObj('TokenService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TokenService, useValue: tokenSpy },
      ],
    });
  });

  it('redirects to /login when NOT authenticated', fakeAsync(() => {
    tokenSpy.getToken.and.returnValue(null);

    const result = authGuard(null as any, null as any);
    tick();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  }));

  it('allows activation when authenticated', fakeAsync(() => {
    tokenSpy.getToken.and.returnValue('token.abc');

    const result = authGuard(null as any, null as any);
    tick();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
