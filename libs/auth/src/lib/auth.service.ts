// projects/auth/src/lib/auth.service.ts
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TokenService } from './token.service';
import {
  ForgotPasswordPayload,
  ForgotPasswordResponseDto,
  LoginPayload,
  LoginResponseDto,
  RegisterPayload,
  RegisterResponseDto,
  ResetPasswordPayload,
  ResetPasswordResponseDto,
  UserProfile,
} from './dtos/auth.dto';
import {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from './models/auth.model';
import {
  mapForgotPasswordDtoToData,
  mapLoginDtoToAuthToken,
  mapRegisterDtoToAuthToken,
  mapResetPasswordDtoToData,
} from './mappers/auth.mapper';
import { AUTH_API_BASE } from '@booking-app/tokens';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<boolean>(
    !!this.tokenService.getToken()
  );
  public get isAuthenticated$(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  constructor(
    @Inject(AUTH_API_BASE) private apiBase: string,
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  public register(payload: RegisterPayload): Observable<RegisterData> {
    return this.http
      .post<RegisterResponseDto>(`${this.apiBase}/register`, payload)
      .pipe(
        tap((resp) => {
          this.tokenService.setToken(resp.accessToken);
          localStorage.setItem('user_id', resp.user.id.toString());
          this.authSubject.next(true);
        }),
        map(mapRegisterDtoToAuthToken)
      );
  }

  public login(payload: LoginPayload): Observable<LoginData> {
    return this.http
      .post<LoginResponseDto>(`${this.apiBase}/login`, payload)
      .pipe(
        tap((resp) => {
          this.tokenService.setToken(resp.accessToken);
          localStorage.setItem('user_id', resp.user.id.toString());
          this.authSubject.next(true);
        }),
        map(mapLoginDtoToAuthToken)
      );
  }

  public forgotPassword(
    payload: ForgotPasswordPayload
  ): Observable<ForgotPasswordData> {
    return this.http
      .post<ForgotPasswordResponseDto>(
        `${this.apiBase}/auth/forgot-password`,
        payload
      )
      .pipe(map(mapForgotPasswordDtoToData));
  }

  public resetPassword(
    payload: ResetPasswordPayload
  ): Observable<ResetPasswordData> {
    return this.http
      .post<ResetPasswordResponseDto>(
        `${this.apiBase}/auth/reset-password`,
        payload
      )
      .pipe(map(mapResetPasswordDtoToData));
  }

  public getUserId(): number | null {
    const raw = localStorage.getItem('user_id');
    return raw ? Number(raw) : null;
  }

  public logout(): void {
    this.tokenService.clearToken();
    localStorage.removeItem('user_id');
    this.authSubject.next(false);
  }

  public getProfile(): Observable<UserProfile> {
    const raw = localStorage.getItem('user_id');
    if (!raw) {
      throw new Error('User ID not available');
    }
    return this.http.get<UserProfile>(`${this.apiBase}/users/${raw}`);
  }
}
