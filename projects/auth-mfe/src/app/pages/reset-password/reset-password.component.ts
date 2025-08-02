import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ResetPasswordPayload } from '@booking-app/auth';
import { RESET_PASSWORD_FORM_CONFIG } from './reset-password.config';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { SharedMaterialModule } from '@booking-app/shared-material';

@Component({
  selector: 'app-reset-password',
  template: `<app-loading-spinner *ngIf="loading"></app-loading-spinner>
    <app-form-error *ngIf="error" [message]="error"></app-form-error>

    <app-dynamic-form
      [config]="config"
      [errorMessages]="errorMessages"
      [submitLabel]="submitLabel"
      (submitted)="onSubmit($event)"
    >
    </app-dynamic-form>`,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,
    FormErrorComponent,
    LoadingSpinnerComponent,
    SharedMaterialModule,
  ],
})
export class ResetPasswordComponent {
  config = RESET_PASSWORD_FORM_CONFIG;
  errorMessages = {
    newPassword: 'Password must be 8+ chars',
    confirmPassword: 'Passwords must match',
  };
  submitLabel = 'Reset Password';

  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(payload: ResetPasswordPayload) {
    this.loading = true;
    this.error = null;

    this.auth.resetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.message || 'Reset failed';
        this.loading = false;
      },
    });
  }
}
