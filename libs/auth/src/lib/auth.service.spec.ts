// projects/auth/src/lib/auth.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '@booking-app/environments/environment';
import { AUTH_API_BASE } from '@booking-app/tokens';

import {
  LoginPayload,
  LoginResponseDto,
  RegisterPayload,
  RegisterResponseDto,
  ForgotPasswordPayload,
  ForgotPasswordResponseDto,
  ResetPasswordPayload,
  ResetPasswordResponseDto,
  UserProfile,
} from './dtos/auth.dto';

import {
  LoginData,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
} from './models/auth.model';

describe('AuthService (TDD)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const tokenSpy = jasmine.createSpyObj<TokenService>('TokenService', [
    'getToken',
    'setToken',
    'clearToken',
  ]);

  beforeEach(() => {
    tokenSpy.getToken.and.returnValue(null);
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenSpy },
        { provide: AUTH_API_BASE, useValue: environment.apiBase },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // … your existing register(), login(), getUserId(), isAuthenticated$, logout(), getProfile() tests …

  it('forgotPassword(): should POST payload and return ForgotPasswordData', (done) => {
    const payload: ForgotPasswordPayload = { email: 'x@x.com' };
    const mockResp: ForgotPasswordResponseDto = {
      message: 'Reset link sent successfully.',
    };

    service.forgotPassword(payload).subscribe((res: ForgotPasswordData) => {
      expect(res).toEqual({ message: mockResp.message });
      done();
    });

    const req = httpMock.expectOne(
      `${environment.apiBase}/auth/forgot-password`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResp);
  });

  it('resetPassword(): should POST payload and return ResetPasswordData', (done) => {
    const payload: ResetPasswordPayload = {
      token: 'abc123',
      newPassword: 'newPW',
      confirmPassword: 'newPW',
    };
    const mockResp: ResetPasswordResponseDto = {
      message: 'Password has been reset.',
    };

    service.resetPassword(payload).subscribe((res: ResetPasswordData) => {
      expect(res).toEqual({ message: mockResp.message });
      done();
    });

    const req = httpMock.expectOne(
      `${environment.apiBase}/auth/reset-password`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResp);
  });
});
