import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { AuthService, RegisterData, RegisterPayload } from '@booking-app/auth';
import { Router } from '@angular/router';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { REGISTER_FORM_CONFIG } from './register.config';
import { Subject } from 'rxjs';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';

@Component({
  selector: 'app-register',
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
      <h2>Register</h2>
      <app-dynamic-form
        [config]="config"
        [errorMessages]="errorMessages"
        submitLabel="Register"
        (submitted)="onSubmit($event)"
      ></app-dynamic-form>
      <app-form-error *ngIf="error" [message]="error"></app-form-error>

      <app-loading-spinner *ngIf="isLoading" />
    </mat-card>
  `,
  styles: ``,
})
export class RegisterComponent {
  isLoading = false;

  error: string | null = null;
  errorMessages: Record<string, string>;

  private destroy$ = new Subject<void>();

  config = REGISTER_FORM_CONFIG;

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Collect error messages from the config
    this.errorMessages = this.config.reduce((acc, { errorMessages = {} }) => {
      Object.assign(acc, errorMessages);
      return acc;
    }, {} as Record<string, string>);
  }

  public onSubmit(formData: RegisterPayload): void {
    this.error = null;
    this.isLoading = true;

    this.authService
      .register(<RegisterPayload>formData)
      .pipe(
        takeUntil(this.destroy$),
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (_res: RegisterData) => {
          this.router.navigate(['/profile']);
        },
        error: (err: any) => {
          this.error = err?.message || 'Registration failed';
        },
      });
  }

  ngOnDestroy() {
    // Emits to all piped takeUntil() calls, then completes the subject
    this.destroy$.next();
    this.destroy$.complete();
  }
}
