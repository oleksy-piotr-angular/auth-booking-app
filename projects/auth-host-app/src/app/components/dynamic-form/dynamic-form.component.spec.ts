// projects/auth-host-app/src/app/components/dynamic-form/dynamic-form.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
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
      errorMessages: { required: 'Required!' } as Record<string, string>,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required, Validators.minLength(6)],
      errorMessages: {
        required: 'Required!',
        minlength: 'Min 6 chars',
      } as Record<string, string>,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatButtonModule,
        DynamicInputComponent,
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
      const expectedControl = <FormControl>component.form.get(f.name)!;
      const expectedMessages = f.errorMessages ?? {};

      expect(dynamicInputs[i].control).toBe(expectedControl);
      expect(dynamicInputs[i].errorMessages).toEqual(expectedMessages);
    });
  });
});
