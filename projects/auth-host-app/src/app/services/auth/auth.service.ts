import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '../../dtos/auth.dto';
import { LoginData, RegisterData } from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public get isAuthenticated$(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      subscriber.next(false);
      subscriber.complete();
    });
  }

  public register(payload: RegisterPayload): Observable<RegisterData> {
    throw new Error('Method not implemented.');
  }

  public login(payload: LoginPayload): Observable<LoginData> {
    throw new Error('Method not implemented.');
  }

  public forgotPassword(arg0: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  public resetPassword(arg0: string, arg1: string): Observable<void> {
    throw new Error('Method not implemented.');
  }

  public getUserId(): number | null {
    throw new Error('Method not implemented.');
  }

  public getProfile(): Observable<UserProfile> {
    throw new Error('Method not implemented.');
  }
  public logout(): void {
    throw new Error('Method not implemented.');
  }
}
