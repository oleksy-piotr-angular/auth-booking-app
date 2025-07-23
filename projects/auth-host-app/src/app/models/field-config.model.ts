import { ValidatorFn } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  validators?: ValidatorFn[];
  errorMessages?: Record<string, string>;
  confirmField?: string;
}
