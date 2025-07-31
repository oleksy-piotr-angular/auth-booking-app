import { Validators } from '@angular/forms';
import { FormFieldConfig } from '../../models/field-config.model';

export const FORGOT_PASSWORD_FORM_CONFIG: FormFieldConfig[] = [
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
];
