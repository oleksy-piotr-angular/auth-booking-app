// projects/auth-host-app/src/app/pages/register/register.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../../models/field-config.model';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterPayload } from '../../dtos/auth.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  template: `
    <app-dynamic-form
      [fields]="fields"
      (submitForm)="onRegister($event)"
    ></app-dynamic-form>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);

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
      placeholder: 'Enter password',
      type: 'password',
      validators: [],
      errorMessages: {},
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Re-enter password',
      type: 'password',
      validators: [],
      errorMessages: {},
    },
  ];

  public onRegister(_: RegisterPayload): void {
    // implementation to come in next steps
  }
}
