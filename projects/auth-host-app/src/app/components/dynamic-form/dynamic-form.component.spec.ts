// projects/auth-host-app/src/app/components/dynamic-form/dynamic-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { InlineErrorsComponent } from '../inline-errors/inline-errors.component';
import { FieldConfig } from '../../models/field-config.model';

describe('DynamicFormComponent', () => {
  let fixture: ComponentFixture<DynamicFormComponent>;
  let component: DynamicFormComponent;

  const fields: FieldConfig[] = [
    {
      name: 'username',
      label: 'Username',
      placeholder: 'Enter username',
      validators: [Validators.required],
      errorMessages: { required: 'Required!' },
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
    component.fields = fields;
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
    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.type).toBe('submit');
    expect(btn.textContent?.trim()).toBe('Submit');
  });

  it('should initialize form controls with empty values', () => {
    expect(component.form.value).toEqual({ username: null, password: null });
  });

  it('should propagate user input to the form group', () => {
    const usernameInput = fixture.debugElement.queryAll(By.css('input'))[0]
      .nativeElement;
    usernameInput.value = 'alice';
    usernameInput.dispatchEvent(new Event('input'));
    expect(component.form.get('username')!.value).toBe('alice');
  });

  it('should disable submit button if form is invalid', () => {
    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.form.get('username')!.setValue('bob');
    component.form.get('password')!.setValue('secret123');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeFalse();
  });

  it('should emit submitForm with form value on submit', () => {
    spyOn(component.submitForm, 'emit');
    component.form.get('username')!.setValue('bob');
    component.form.get('password')!.setValue('secret123');
    fixture.detectChanges();
    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    btn.click();
    expect(component.submitForm.emit).toHaveBeenCalledWith({
      username: 'bob',
      password: 'secret123',
    });
  });

  it('passes the correct control and errorMessages into each DynamicInputComponent', () => {
    const dynamicInputs = fixture.debugElement
      .queryAll(By.directive(DynamicInputComponent))
      .map((de) => de.componentInstance as DynamicInputComponent);

    fields.forEach((f, i) => {
      const expectedControl = component.form.get(f.name) as FormControl;
      const expectedMessages = f.errorMessages ?? {};
      expect(dynamicInputs[i].control).toBe(expectedControl);
      expect(dynamicInputs[i].errorMessages).toEqual(expectedMessages);
    });
  });

  //
  // Cross-field password confirmation tests
  //

  /** Extended config with confirmField for password match */
  const confirmConfig: FieldConfig[] = [
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

  describe('with confirmField on password', () => {
    beforeEach(() => {
      component.fields = confirmConfig;
      component.ngOnInit(); // rebuild form with new config
      fixture.detectChanges();
    });

    it('should disable submit and show mismatch error when passwords differ', () => {
      component.form.get('password')!.setValue('foo123');
      component.form.get('confirmPassword')!.setValue('bar456');
      component.form.markAllAsTouched();
      fixture.detectChanges();

      // submit remains disabled
      const btn = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLButtonElement;
      expect(btn.disabled).toBeTrue();

      // confirmPassword input has InlineErrorsComponent rendering mismatch message
      const confirmDE = fixture.debugElement
        .queryAll(By.directive(DynamicInputComponent))
        .find(
          (de) =>
            de.componentInstance.control ===
            component.form.get('confirmPassword')
        )!;
      const inlineDE = confirmDE.query(By.directive(InlineErrorsComponent));
      expect(inlineDE).toBeTruthy();
      expect(inlineDE.nativeElement.textContent).toContain(
        'Passwords must match'
      );
    });

    it('should enable submit and suppress error when passwords match', () => {
      component.form.get('password')!.setValue('same123');
      component.form.get('confirmPassword')!.setValue('same123');
      component.form.markAllAsTouched();
      fixture.detectChanges();

      // submit becomes enabled
      const btn = fixture.debugElement.query(By.css('button'))
        .nativeElement as HTMLButtonElement;
      expect(btn.disabled).toBeFalse();

      // InlineErrorsComponent is present but shows no text
      const confirmDE = fixture.debugElement
        .queryAll(By.directive(DynamicInputComponent))
        .find(
          (de) =>
            de.componentInstance.control ===
            component.form.get('confirmPassword')
        )!;
      const inlineDE = confirmDE.query(By.directive(InlineErrorsComponent));
      expect(inlineDE).toBeTruthy();
      expect(inlineDE.nativeElement.textContent.trim()).toBe('');
    });
  });
});
