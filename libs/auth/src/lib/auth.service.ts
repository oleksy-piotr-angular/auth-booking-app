// projects/auth/src/lib/auth.service.ts
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TokenService } from './token.service';
import {
  LoginPayload,
  LoginResponseDto,
  RegisterPayload,
  RegisterResponseDto,
  UserProfile,
} from './dtos/auth.dto';
import { LoginData, RegisterData } from './models/auth.model';
import {
  mapLoginDtoToAuthToken,
  mapRegisterDtoToAuthToken,
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

  public forgotPassword(email: string): Observable<unknown> {
    return this.http.post(`${this.apiBase}/auth/forgot-password`, {
      email,
    });
  }

  public resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/auth/reset-password`, {
      token,
      password,
    });
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
