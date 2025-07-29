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

describe('AuthService (TDD)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // jasmine spy‐based stub of your TokenService
  const tokenSpy = jasmine.createSpyObj<TokenService>('TokenService', [
    'getToken',
    'setToken',
    'clearToken',
  ]);

  beforeEach(() => {
    // default getToken() returns null
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

  it('register(): should POST /register, return mapped data, and save token+userID', (done) => {
    const payload = { name: 'Alice', email: 'alice@x.com', password: 'pw123' };
    const mockResp = {
      accessToken: 'jwt.abc.123',
      user: { id: 7, email: 'alice@x.com' },
    };

    service.register(payload).subscribe((result) => {
      expect(result).toEqual({ id: 7, token: 'jwt.abc.123' });
      expect(tokenSpy.setToken).toHaveBeenCalledWith('jwt.abc.123');
      expect(localStorage.getItem('user_id')).toBe('7');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiBase}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResp);
  });

  it('login(): should POST /login, save token+userID', (done) => {
    const payload = { email: 'bob@y.com', password: 'pw!' };
    const mockResp = {
      accessToken: 'jwt.xyz.789',
      user: { id: 42, email: 'bob@y.com' },
    };

    service.login(payload).subscribe(() => {
      expect(tokenSpy.setToken).toHaveBeenCalledWith('jwt.xyz.789');
      expect(localStorage.getItem('user_id')).toBe('42');
      done();
    });

    const req = httpMock.expectOne(`${environment.apiBase}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResp);
  });

  it('forgotPassword(): should POST /auth/forgot-password with email', () => {
    service.forgotPassword('x@x.com').subscribe();
    const req = httpMock.expectOne(
      `${environment.apiBase}/auth/forgot-password`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'x@x.com' });
    req.flush({});
  });

  it('resetPassword(): should POST /auth/reset-password with token+password', () => {
    service.resetPassword('abc123', 'newPW').subscribe();
    const req = httpMock.expectOne(
      `${environment.apiBase}/auth/reset-password`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'abc123', password: 'newPW' });
    req.flush({});
  });

  it('getUserId(): should parse stored user ID', () => {
    localStorage.setItem('user_id', '55');
    expect(service.getUserId()).toBe(55);
  });

  it('isAuthenticated$: defaults to false when no token', (done) => {
    // tokenSpy.getToken() → null
    service.isAuthenticated$.subscribe((val) => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('isAuthenticated$: true when token present at startup', (done) => {
    tokenSpy.getToken.and.returnValue('some-token');
    // reconfigure so constructor reads the new stub value
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: TokenService, useValue: tokenSpy }],
    });
    service = TestBed.inject(AuthService);

    service.isAuthenticated$.subscribe((val) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('logout(): should clear token via stub and remove userID', () => {
    localStorage.setItem('user_id', '3');
    service.logout();
    expect(tokenSpy.clearToken).toHaveBeenCalled();
    expect(localStorage.getItem('user_id')).toBeNull();
  });

  it('getProfile(): should GET /users/:id when userID present', () => {
    localStorage.setItem('user_id', '100');
    const mockProfile = { id: 100, name: 'Cleo', email: 'cleo@z.com' };
    let actual: any;

    service.getProfile().subscribe((p) => (actual = p));

    const req = httpMock.expectOne(`${environment.apiBase}/users/100`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
    expect(actual).toEqual(mockProfile);
  });

  it('getProfile(): should throw Error when no userID', () => {
    localStorage.removeItem('user_id');
    expect(() => service.getProfile()).toThrowError('User ID not available');
  });
});
