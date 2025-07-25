// projects/_shell-app/src/app/shared/dynamic-form/inline-error/inline-error.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { InlineErrorsComponent } from './inline-errors.component';

describe('InlineErrorsComponent', () => {
  let fixture: ComponentFixture<InlineErrorsComponent>;
  let component: InlineErrorsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        NoopAnimationsModule,
        InlineErrorsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InlineErrorsComponent);
    component = fixture.componentInstance;
  });

  it('should render no errors when control is pristine', () => {
    const control = new FormControl('', Validators.required);
    component.control = control;
    component.errorMessages = { required: 'Required!' };

    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBe(0);
  });

  it('should render no errors when control has no errors', () => {
    const control = new FormControl('value', Validators.required);
    control.markAsTouched();
    component.control = control;
    component.errorMessages = { required: 'Required!' };

    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBe(0);
  });

  it('should render error messages for each control error', () => {
    const control = new FormControl('');
    control.setErrors({
      required: true,
      minlength: { requiredLength: 5, actualLength: 2 },
    });
    // must mark as touched for errors to show
    control.markAsTouched();

    component.control = control;
    component.errorMessages = {
      required: 'This field is required',
      minlength: 'Too short',
    };

    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBe(2);
    expect(errors[0].nativeElement.textContent.trim()).toBe(
      'This field is required'
    );
    expect(errors[1].nativeElement.textContent.trim()).toBe('Too short');
  });
});
