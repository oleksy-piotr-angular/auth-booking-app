// auth.interceptor.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HttpClient,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { TokenService } from '@booking-app/auth';

// 1) Adapter class so Angular sees a valid HttpInterceptor
class AuthInterceptorAdapter implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return authInterceptor(req, next.handle.bind(next));
  }
}

describe('authInterceptor (wrapped)', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let fakeTokenSvc: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    fakeTokenSvc = jasmine.createSpyObj('ITokenService', ['getToken']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // 2) Register our adapter as an interceptor
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorAdapter,
          multi: true,
        },
        // 3) Stub the token service
        {
          provide: TokenService,
          useValue: fakeTokenSvc,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('does NOT add Authorization header when token is null', () => {
    fakeTokenSvc.getToken.and.returnValue(null);

    http.get('/foo').subscribe();
    const req = httpMock.expectOne('/foo');

    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('adds Bearer header when token is present', () => {
    const tk = 'my-jwt';
    fakeTokenSvc.getToken.and.returnValue(tk);

    http.get('/foo').subscribe();
    const req = httpMock.expectOne('/foo');

    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${tk}`);
    req.flush({});
  });
});
