import { Validators } from '@angular/forms';
import { FormFieldConfig } from '../../models/field-config.model';

export const RESET_PASSWORD_FORM_CONFIG: FormFieldConfig[] = [
  {
    name: 'token',
    type: 'hidden',
    label: 'Reset Token',
    validators: [Validators.required],
    errorMessages: {
      required: 'Reset token is required',
    },
  },
  {
    name: 'password',
    type: 'password',
    label: 'New Password',
    placeholder: 'Enter new password',
    validators: [Validators.required],
    errorMessages: {
      required: 'Password is required',
    },
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Re-enter new password',
    validators: [Validators.required],
    errorMessages: {
      required: 'Password confirmation is required',
    },
  },
];
