// projects/auth-host-app/src/app/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { environment } from '../../../../../../environments/environment';
import { TokenService } from '../token/token.service';

import {
  LoginPayload,
  RegisterPayload,
  UserProfile,
  LoginResponseDto,
  RegisterResponseDto,
} from '../../dtos/auth.dto';
import { LoginData, RegisterData } from '../../models/auth.model';

import {
  mapLoginDtoToAuthToken,
  mapRegisterDtoToAuthToken,
} from '../../mappers/auth.mapper';

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

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public register(payload: RegisterPayload): Observable<RegisterData> {
    return this.http
      .post<RegisterResponseDto>(`${environment.apiBase}/register`, payload)
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
      .post<LoginResponseDto>(`${environment.apiBase}/login`, payload)
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
    return this.http.post(`${environment.apiBase}/auth/forgot-password`, {
      email,
    });
  }

  public resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiBase}/auth/reset-password`, {
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
    return this.http.get<UserProfile>(`${environment.apiBase}/users/${raw}`);
  }
}
