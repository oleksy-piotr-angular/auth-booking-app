// projects/auth-host-app/src/app/shared/dynamic-form/dynamic-input/dynamic-input.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DynamicInputComponent } from './dynamic-input.component';

describe('DynamicInputComponent', () => {
  let fixture: ComponentFixture<DynamicInputComponent>;
  let component: DynamicInputComponent;
  let control: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        DynamicInputComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInputComponent);
    component = fixture.componentInstance;
    control = new FormControl('');
    component.control = control;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a label when provided', () => {
    component.label = 'Username';
    fixture.detectChanges();

    const labelEl = fixture.debugElement.query(By.css('mat-label'));
    expect(labelEl.nativeElement.textContent.trim()).toBe('Username');
  });

  it('should bind placeholder and type to the native input', () => {
    component.placeholder = 'Enter username';
    component.type = 'email';
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl.attributes['placeholder']).toBe('Enter username');
    expect(inputEl.attributes['type']).toBe('email');
  });

  it('should propagate control value to the input', () => {
    control.setValue('alice');
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.value).toBe('alice');
  });

  it('should update form control when user types', () => {
    fixture.detectChanges();
    const inputEl: HTMLInputElement = fixture.debugElement.query(
      By.css('input')
    ).nativeElement;
    inputEl.value = 'bob';
    inputEl.dispatchEvent(new Event('input'));
    expect(control.value).toBe('bob');
  });

  it('should set disabled state on the native input', () => {
    control.disable();
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputEl.disabled).toBeTrue();
  });

  it('should apply material error state when control invalid and touched', () => {
    // 1) Setup a required validator and trigger an error
    control.setValidators([(v) => (v.value ? null : { required: true })]);
    control.setValue('');
    control.markAsTouched();
    component.errorMessages = { required: 'Required!' };
    fixture.detectChanges();

    // 2) Material adds this class when the control is invalid + touched
    const formFieldDE = fixture.debugElement.query(By.css('mat-form-field'));
    expect(formFieldDE.classes['mat-form-field-invalid']).toBeTrue();

    // 3) And our InlineErrorsComponent should render the mat-error
    const errorEl = fixture.debugElement.query(By.css('mat-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent.trim()).toBe('Required!');
  });
});
