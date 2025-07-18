// passwords-match.validator.spec.ts
import { FormControl, FormGroup } from '@angular/forms';
import { passwordsMatchValidator } from './passwords-match.validator';

describe('passwordsMatchValidator', () => {
  function makeGroup(pw: string, cp: string) {
    return new FormGroup(
      {
        password: new FormControl(pw),
        confirmPassword: new FormControl(cp),
      },
      { validators: passwordsMatchValidator('password', 'confirmPassword') }
    );
  }

  it('returns null when values match', () => {
    const group = makeGroup('abc', 'abc');
    expect(group.valid).toBeTrue();
    expect(group.errors).toBeNull();
  });

  it('sets passwordMismatch when values differ', () => {
    const group = makeGroup('a', 'b');
    expect(group.valid).toBeFalse();
    expect(
      group.get('confirmPassword')!.hasError('passwordMismatch')
    ).toBeTrue();
  });
});
