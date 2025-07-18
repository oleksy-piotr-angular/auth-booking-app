// passwords-match.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(
  passwordKey: string,
  confirmKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pwCtrl = group.get(passwordKey);
    const cpCtrl = group.get(confirmKey);
    if (!pwCtrl || !cpCtrl) {
      return null;
    }
    const match = pwCtrl.value === cpCtrl.value;
    // sync the confirm control’s errors
    if (!match) {
      const errs = cpCtrl.errors || {};
      cpCtrl.setErrors({ ...errs, passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // remove only our passwordMismatch key
      if (cpCtrl.hasError('passwordMismatch')) {
        const { passwordMismatch, ...rest } = cpCtrl.errors!;
        cpCtrl.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    }
  };
}
