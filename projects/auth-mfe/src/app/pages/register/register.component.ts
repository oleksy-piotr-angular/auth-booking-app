import { Component } from '@angular/core';
import { FormFieldConfig } from '../../models/field-config.model';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  template: ` <p>register works!</p> `,
  styles: ``,
})
export class RegisterComponent {
  public config: FormFieldConfig[] = [
    {
      name: 'username',
      label: 'Username',
      placeholder: 'Enter your username',
      validators: [Validators.required, Validators.minLength(3)],
      errorMessages: {
        required: 'Username is required',
        minlength: 'Username must be at least 3 characters',
      },
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      validators: [Validators.required, Validators.email],
      errorMessages: {
        required: 'Email is required',
        email: 'Invalid email format',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter a password',
      validators: [Validators.required, Validators.minLength(6)],
      errorMessages: {
        required: 'Password is required',
        minlength: 'Password must be at least 6 characters',
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      placeholder: 'Repeat your password',
      validators: [Validators.required],
      confirmField: 'password',
      errorMessages: {
        required: 'Please confirm your password',
        passwordMismatch: 'Passwords do not match',
      },
    },
  ];
  public error: string | null = null;

  public onSubmit(): void {
    throw new Error('Method not implemented.');
  }
}
