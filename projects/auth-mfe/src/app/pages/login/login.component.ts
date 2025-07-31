import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { AuthService, LoginData, LoginPayload } from '@booking-app/auth';
import { Router } from '@angular/router';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { LOGIN_FORM_CONFIG } from './login.config';
import { Subject } from 'rxjs';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,
    FormErrorComponent,
    SharedMaterialModule,
    LoadingSpinnerComponent,
  ],
  template: `
    <mat-card>
      <h2>Login</h2>

      <app-dynamic-form
        [config]="config"
        [errorMessages]="errorMessages"
        submitLabel="Login"
        (submitted)="onSubmit($event)"
      ></app-dynamic-form>

      <app-form-error *ngIf="error" [message]="error"></app-form-error>

      <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>
    </mat-card>
  `,
  styles: ``,
})
export class LoginComponent implements OnDestroy {
  isLoading = false;
  error: string | null = null;
  config = LOGIN_FORM_CONFIG;
  errorMessages: Record<string, string>;

  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // flatten all errorMessages from the config into one map
    this.errorMessages = this.config.reduce((acc, cur) => {
      Object.assign(acc, cur.errorMessages || {});
      return acc;
    }, {} as Record<string, string>);
  }

  onSubmit(formData: LoginPayload): void {
    this.error = null;
    this.isLoading = true;

    this.authService
      .login(formData)
      .pipe(
        takeUntil(this.destroy$),
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (_res: LoginData) => {
          this.router.navigate(['/profile']);
        },
        error: (err: any) => {
          this.error = err?.message || 'Login failed';
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
