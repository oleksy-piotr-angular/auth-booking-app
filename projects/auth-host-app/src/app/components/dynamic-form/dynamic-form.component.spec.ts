// projects/auth-host-app/src/app/components/dynamic-form/dynamic-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { InlineErrorsComponent } from '../inline-errors/inline-errors.component';
import { FormFieldConfig } from '../../models/field-config.model';

describe('DynamicFormComponent', () => {
  let fixture: ComponentFixture<DynamicFormComponent>;
  let component: DynamicFormComponent;

  const fields: FormFieldConfig[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      validators: [Validators.required, Validators.minLength(3)],
      errorMessages: {
        required: 'Required!',
        minlength: 'Min 3 chars',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required, Validators.minLength(6)],
      errorMessages: {
        required: 'Required!',
        minlength: 'Min 6 chars',
      },
    },
  ];

  /** Extended config with confirmField for password matching */
  const confirmConfig: FormFieldConfig[] = [
    ...fields,
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      validators: [Validators.required],
      errorMessages: {
        required: 'Required!',
        passwordMismatch: 'Passwords must match',
      },
      confirmField: 'password',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        DynamicInputComponent,
        InlineErrorsComponent,
        DynamicFormComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.config = fields;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one DynamicInput per field config', () => {
    const inputs = fixture.debugElement.queryAll(
      By.directive(DynamicInputComponent)
    );
    expect(inputs.length).toBe(fields.length);
  });

  it('renders a default submit button', () => {
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent?.trim()).toBe('Submit');
  });

  it('should initialize form controls with empty values', () => {
    expect(component.form.value).toEqual({ username: null, password: null });
  });

  it('should propagate user input to the form group', () => {
    const inputEl = fixture.debugElement.queryAll(By.css('input'))[0]
      .nativeElement as HTMLInputElement;
    inputEl.value = 'alice';
    inputEl.dispatchEvent(new Event('input'));
    expect(component.form.get('username')!.value).toBe('alice');
  });

  it('should disable submit button if form is invalid', () => {
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.form.get('username')!.setValue('bob');
    component.form.get('password')!.setValue('secret123');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeFalse();
  });

  it('should emit submitted with form value on submit', () => {
    spyOn(component.submitted, 'emit');
    component.form.get('username')!.setValue('bob');
    component.form.get('password')!.setValue('secret123');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    btn.click();
    expect(component.submitted.emit).toHaveBeenCalledWith({
      username: 'bob',
      password: 'secret123',
    });
  });

  // ——— we removed the “.control” assertion here ———

  describe('with confirmField on password', () => {
    beforeEach(() => {
      component.config = confirmConfig;
      component.ngOnInit(); // rebuild form
      // satisfy the username control too
      component.form.get('username')!.setValue('alice123');
      fixture.detectChanges();
    });

    it('should disable submit and show mismatch error when passwords differ', () => {
      component.form.get('password')!.setValue('foo123');
      component.form.get('confirmPassword')!.setValue('bar456');
      component.form.markAllAsTouched();
      fixture.detectChanges();

      const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
        .nativeElement as HTMLButtonElement;
      expect(btn.disabled).toBeTrue();

      const confirmDE = fixture.debugElement
        .queryAll(By.directive(DynamicInputComponent))
        .find(
          (de) =>
            de.componentInstance['formControl'] ===
            component.form.get('confirmPassword')
        )!;
      const inlineDE = confirmDE.query(By.directive(InlineErrorsComponent))!;
      expect(inlineDE.nativeElement.textContent).toContain(
        'Passwords must match'
      );
    });

    it('should enable submit and suppress error when passwords match', () => {
      component.form.get('password')!.setValue('same123');
      component.form.get('confirmPassword')!.setValue('same123');
      component.form.markAllAsTouched();
      fixture.detectChanges();

      const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
        .nativeElement as HTMLButtonElement;
      expect(btn.disabled).toBeFalse();

      const confirmDE = fixture.debugElement
        .queryAll(By.directive(DynamicInputComponent))
        .find(
          (de) =>
            de.componentInstance['formControl'] ===
            component.form.get('confirmPassword')
        )!;
      const inlineDE = confirmDE.query(By.directive(InlineErrorsComponent))!;
      expect(inlineDE.nativeElement.textContent.trim()).toBe('');
    });
  });

  //
  // Additional edge-case tests
  //

  it('should render custom submitLabel when provided', () => {
    component.submitLabel = 'Register Now';
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn.textContent?.trim()).toBe('Register Now');
  });

  it('should not emit submitted if the form is invalid', () => {
    spyOn(component.submitted, 'emit');
    component.onSubmit(new Event('submit'));
    expect(component.submitted.emit).not.toHaveBeenCalled();
  });

  it('should pass global errorMessages into InlineErrorsComponent', async () => {
    component.config = [
      {
        name: 'user',
        label: 'User',
        type: 'text',
        validators: [Validators.required],
      },
    ];
    component.errorMessages = { required: 'Global Required Msg' };
    component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();

    const ctrl = component.form.get('user')!;
    ctrl.markAsTouched();
    ctrl.setValue('');
    ctrl.updateValueAndValidity();
    fixture.detectChanges();
    await fixture.whenStable();

    const inlineDE = fixture.debugElement.query(
      By.directive(InlineErrorsComponent)
    )!;
    const inlineCmp = inlineDE.componentInstance as InlineErrorsComponent;
    expect(inlineCmp.errorMessages).toEqual({
      required: 'Global Required Msg',
    });
  });
});
