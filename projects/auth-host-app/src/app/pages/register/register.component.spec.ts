import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  createAuthServiceSpy,
  provideMockAuthService,
  createRouterSpy,
  provideMockRouter,
} from 'projects/auth-host-app/testing/test-helpers';
import { Validators } from '@angular/forms';

import { FormFieldConfig } from '../../models/field-config.model';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { DynamicInputComponent } from '../../components/dynamic-input/dynamic-input.component';
import { InlineErrorsComponent } from '../../components/inline-errors/inline-errors.component';

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authSpy: jasmine.SpyObj<any>;
  let routerSpy: jasmine.SpyObj<any>;

  const fullConfig: FormFieldConfig[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      validators: [Validators.required, Validators.email],
      errorMessages: {
        required: 'Email is required',
        email: 'Invalid email',
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [Validators.required, Validators.minLength(6)],
      errorMessages: {
        required: 'Password is required',
        minlength: 'Min 6 chars',
      },
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password',
      validators: [Validators.required],
      errorMessages: {
        required: 'Confirm is required',
        passwordMismatch: 'Passwords do not match',
      },
      confirmField: 'password',
    },
  ];

  beforeEach(async () => {
    authSpy = createAuthServiceSpy();
    routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [
        DynamicFormComponent,
        DynamicInputComponent,
        InlineErrorsComponent,
        MatCardModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockAuthService(authSpy),
        provideMockRouter(routerSpy),
      ],
      declarations: [RegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.formConfig = fullConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders all three fields including confirmPassword', () => {
    const inputs = fixture.debugElement.queryAll(
      By.directive(DynamicInputComponent)
    );
    expect(inputs.length).toBe(3);
    expect(inputs[2].componentInstance.label).toBe('Confirm Password');
  });

  it('disables submit and shows mismatch error when passwords differ', () => {
    // fill email so form doesn’t stay invalid because of missing email
    const df = fixture.debugElement.query(By.directive(DynamicFormComponent))
      .componentInstance as DynamicFormComponent;
    df.form.get('email')!.setValue('test@x.com');

    df.form.get('password')!.setValue('123456');
    df.form.get('confirmPassword')!.setValue('abcdef');
    df.form.markAllAsTouched();
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeTrue();

    const err = fixture.debugElement
      .queryAll(By.directive(DynamicInputComponent))[2]
      .query(By.directive(InlineErrorsComponent)).nativeElement;
    expect(err.textContent).toContain('Passwords do not match');
  });

  it('enables submit when passwords match and calls register()', fakeAsync(() => {
    authSpy.register.and.returnValue(of({}));

    const df = fixture.debugElement.query(By.directive(DynamicFormComponent))
      .componentInstance as DynamicFormComponent;
    df.form.get('email')!.setValue('test@x.com');
    df.form.get('password')!.setValue('abcd12');
    df.form.get('confirmPassword')!.setValue('abcd12');
    df.form.markAllAsTouched();
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    expect(btn.disabled).toBeFalse();

    btn.click();
    tick();

    expect(authSpy.register).toHaveBeenCalledWith({
      email: 'test@x.com',
      password: 'abcd12',
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/welcome']);
  }));

  it('shows top‐level error message when register() errors', fakeAsync(() => {
    authSpy.register.and.returnValue(
      throwError(() => ({ message: 'Server died' }))
    );

    const df = fixture.debugElement.query(By.directive(DynamicFormComponent))
      .componentInstance as DynamicFormComponent;
    df.form.get('email')!.setValue('e@e.com');
    df.form.get('password')!.setValue('pwd123');
    df.form.get('confirmPassword')!.setValue('pwd123');
    df.form.markAllAsTouched();
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button[type="submit"]'))
      .nativeElement as HTMLButtonElement;
    btn.click();
    tick();
    fixture.detectChanges();

    const topErr = fixture.nativeElement.querySelector('.error');
    expect(topErr.textContent).toContain('Server died');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));
});
