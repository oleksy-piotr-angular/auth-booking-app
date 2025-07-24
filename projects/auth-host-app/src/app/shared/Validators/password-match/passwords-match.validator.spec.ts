import { FormControl, FormGroup } from '@angular/forms';
import { passwordsMatchValidator } from './passwords-match.validator';

describe('passwordsMatchValidator', () => {
  function makeGroup(pw: string, cp: string) {
    // Create the confirm control with the validator attached
    const confirmControl = new FormControl(cp, [
      passwordsMatchValidator('password', 'confirmPassword'),
    ]);

    // Build the group, so confirmControl.parent is set
    const group = new FormGroup({
      password: new FormControl(pw),
      confirmPassword: confirmControl,
    });

    // Trigger validation now that parent exists
    confirmControl.updateValueAndValidity({ onlySelf: true });
    return group;
  }

  it('marks confirm invalid when values differ', () => {
    const group = makeGroup('foo123', 'bar456');
    const cp = group.get('confirmPassword')!;
    expect(cp.valid).toBeFalse();
    expect(cp.hasError('passwordMismatch')).toBeTrue();
  });

  it('marks confirm valid when values match', () => {
    const group = makeGroup('same123', 'same123');
    const cp = group.get('confirmPassword')!;
    expect(cp.valid).toBeTrue();
    expect(cp.errors).toBeNull();
  });

  it('skips mismatch when one side is empty', () => {
    const group1 = makeGroup('', 'foo');
    const cp1 = group1.get('confirmPassword')!;
    expect(cp1.errors).toBeNull();

    const group2 = makeGroup('foo', '');
    const cp2 = group2.get('confirmPassword')!;
    expect(cp2.errors).toBeNull();
  });
});
