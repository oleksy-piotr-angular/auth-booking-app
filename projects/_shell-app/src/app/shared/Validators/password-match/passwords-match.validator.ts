// passwords-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  passwordKey: string,
  confirmKey: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // control is the confirm-password FormControl
    const parent = control.parent;
    if (!parent) {
      // Not yet hooked into a FormGroup
      return null;
    }

    const passwordValue = parent.get(passwordKey)?.value;
    const confirmValue = control.value;

    // Skip when either is null, undefined, or empty string
    if (!passwordValue || !confirmValue) {
      return null;
    }

    // If they match, no error; otherwise flag mismatch
    return passwordValue === confirmValue ? null : { passwordMismatch: true };
  };
}
