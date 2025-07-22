import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { FieldConfig } from '../../models/field-config.model';
import { AuthService } from '../../services/auth/auth.service';
import { LoginPayload } from '../../dtos/auth.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, FormErrorComponent],
  template: `
    <app-dynamic-form
      [fields]="fields"
      (submitForm)="onLogin($event)"
    ></app-dynamic-form>
    <app-form-error *ngIf="errorMsg" [message]="errorMsg"></app-form-error>
  `,
  styles: ``,
})
export class LoginComponent {
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public fields: FieldConfig[] = [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter email',
      validators: [],
      errorMessages: {},
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [],
      errorMessages: {},
    },
  ];

  public errorMsg: string | null = null;

  public onLogin(credentials: LoginPayload): void {
    this.auth.login(credentials).subscribe({
      next: () => this.router.navigate(['/auth/profile']),
      error: (err) => (this.errorMsg = err.error.message),
    });
  }
}
