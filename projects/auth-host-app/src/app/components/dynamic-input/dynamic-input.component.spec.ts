// projects/auth-host-app/src/app/components/dynamic-input/dynamic-input.component.spec.ts

import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DynamicInputComponent } from './dynamic-input.component';
import { InlineErrorsComponent } from '../inline-errors/inline-errors.component';

@Component({
  template: `
    <form [formGroup]="form">
      <app-dynamic-input
        formControlName="test"
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [errorMessages]="errorMessages"
      ></app-dynamic-input>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({ test: new FormControl('') });
  label = 'Initial Label';
  placeholder = 'Initial Placeholder';
  type = 'text';
  errorMessages: Record<string, string> = {};
}

describe('DynamicInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let inputCmp: DynamicInputComponent;
  let inputEl: HTMLInputElement;
  let control: FormControl;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule, // ← suppress Material animations errors
        MatFormFieldModule,
        MatInputModule,
        DynamicInputComponent, // ← standalone component
        InlineErrorsComponent, // ← standalone inline‐errors
      ],
      declarations: [TestHostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    control = host.form.get('test') as FormControl;
    fixture.detectChanges();

    const de = fixture.debugElement.query(By.directive(DynamicInputComponent));
    inputCmp = de.componentInstance as DynamicInputComponent;
    inputEl = de.nativeElement.querySelector('input');
  });

  it('should create', () => {
    expect(inputCmp).toBeTruthy();
    expect(inputCmp.formControl).toBe(control);
  });

  it('renders an <mat-label> when @Input() label is provided', () => {
    host.label = 'Username';
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('mat-label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent.trim()).toBe('Username');
  });

  it('binds placeholder and type to the native input', () => {
    host.placeholder = 'Enter username';
    host.type = 'email';
    fixture.detectChanges();

    expect(inputEl.placeholder).toBe('Enter username');
    expect(inputEl.type).toBe('email');
  });

  it('propagates control value to the input', () => {
    control.setValue('alice');
    fixture.detectChanges();
    expect(inputEl.value).toBe('alice');
  });

  it('updates form control when user types', () => {
    inputEl.value = 'bob';
    inputEl.dispatchEvent(new Event('input'));
    expect(control.value).toBe('bob');
  });

  it('sets disabled state on the native input', () => {
    control.disable();
    fixture.detectChanges();
    expect(inputEl.disabled).toBeTrue();

    control.enable();
    fixture.detectChanges();
    expect(inputEl.disabled).toBeFalse();
  });

  it('applies material error state when control invalid and touched', () => {
    control.setValidators([Validators.required]);
    control.setValue('');
    control.markAsTouched();
    host.errorMessages = { required: 'Required!' };
    fixture.detectChanges();

    const formFieldDE = fixture.debugElement.query(By.css('mat-form-field'));
    expect(formFieldDE.classes['mat-form-field-invalid']).toBeTrue();

    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent.trim()).toBe('Required!');
  });
});
