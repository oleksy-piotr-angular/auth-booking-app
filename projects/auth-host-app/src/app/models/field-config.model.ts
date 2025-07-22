import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  validators?: ValidatorFn[];
  errorMessages?: Record<string,string>;
}
