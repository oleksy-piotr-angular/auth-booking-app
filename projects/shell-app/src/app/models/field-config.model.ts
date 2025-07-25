// projects/_shell-app/src/app/models/field-config.model.ts

import { ValidatorFn, AsyncValidatorFn } from '@angular/forms';

/**
 * Describes one line in a DynamicFormComponent:
 * - `name`                → the key in the FormGroup
 * - `label`               → the <mat-label> text
 * - `placeholder?`        → optional placeholder on the <input>
 * - `type?`               → input type (text/password/etc)
 * - `validators?`         → sync validators to pass to FormControl
 * - `asyncValidators?`    → async validators, if you need them
 * - `errorMessages?`      → a map of validation error-keys → user messages
 * - `confirmField?`       → name of the sibling control to match against
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  errorMessages?: Record<string, string>;
  confirmField?: string;
}
