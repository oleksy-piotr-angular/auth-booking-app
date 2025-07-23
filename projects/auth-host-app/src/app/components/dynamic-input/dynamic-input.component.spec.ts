// projects/auth-host-app/src/app/shared/dynamic-form/dynamic-input/dynamic-input.component.spec.ts

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component } from '@angular/core';

import { DynamicInputComponent } from './dynamic-input.component';
import { InlineErrorsComponent } from '../inline-errors/inline-errors.component';

@Component({
  template: `
    <form [formGroup]="form">
      <app-dynamic-input
        formControlName="testControl"
        [label]="label"
        [placeholder]="placeholder"
        [type]="type"
        [errorMessages]="errorMessages"
      ></app-dynamic-input>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({ testControl: new FormControl('') });
  label = 'My Label';
  placeholder = 'Enter value';
  type = 'text';
  errorMessages: Record<string, string> = {};
}

describe('DynamicInputComponent (CVA)', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let inputDe: any;
  let inputEl: HTMLInputElement;
  let inputCmp: DynamicInputComponent;
  let control: FormControl;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        DynamicInputComponent,
        InlineErrorsComponent,
      ],
      declarations: [TestHostComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    control = hostComponent.form.get('testControl') as FormControl;
    hostFixture.detectChanges();

    inputDe = hostFixture.debugElement.query(
      By.directive(DynamicInputComponent)
    );
    inputCmp = inputDe.componentInstance as DynamicInputComponent;
    inputEl = inputDe.query(By.css('input')).nativeElement as HTMLInputElement;
  });

  it('should create', () => {
    expect(inputCmp).toBeTruthy();
  });

  it('should render a label when provided', () => {
    hostComponent.label = 'Username';
    hostFixture.detectChanges();
    const labelEl = hostFixture.nativeElement.querySelector('mat-label');
    expect(labelEl.textContent.trim()).toBe('Username');
  });

  it('should bind placeholder and type to the native input', () => {
    hostComponent.placeholder = 'Enter username';
    hostComponent.type = 'email';
    hostFixture.detectChanges();
    expect(inputEl.placeholder).toBe('Enter username');
    expect(inputEl.type).toBe('email');
  });

  it('should propagate control value to the input', () => {
    control.setValue('alice');
    hostFixture.detectChanges();
    expect(inputEl.value).toBe('alice');
  });

  it('should update form control when user types', () => {
    inputEl.value = 'bob';
    inputEl.dispatchEvent(new Event('input'));
    expect(control.value).toBe('bob');
  });

  it('should set disabled state on the native input', () => {
    control.disable();
    hostFixture.detectChanges();
    expect(inputEl.disabled).toBeTrue();
    control.enable();
    hostFixture.detectChanges();
    expect(inputEl.disabled).toBeFalse();
  });

  it('should apply material error state when control invalid and touched', () => {
    // 1) Setup required validator and trigger an error
    control.setValidators([Validators.required]);
    control.setValue('');
    control.markAsTouched();
    hostComponent.errorMessages = { required: 'Required!' };
    hostFixture.detectChanges();

    // 2) Material adds this class when invalid + touched
    const formFieldDE = hostFixture.debugElement.query(
      By.css('mat-form-field')
    );
    expect(formFieldDE.classes['mat-form-field-invalid']).toBeTrue();

    // 3) And our InlineErrorsComponent should render the mat-error
    const errorEl = hostFixture.debugElement.query(By.css('mat-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent.trim()).toBe('Required!');
  });
});
