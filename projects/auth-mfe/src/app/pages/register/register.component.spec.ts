// projects/auth-mfe/src/app/pages/register/register.component.spec.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import {
  createAuthServiceSpy,
  createRouterSpy,
  getOptionalStub,
  getStub,
  provideMockAuthService,
  provideMockRouter,
} from 'testing/test-helpers';
import { AuthService, RegisterData } from '@booking-app/auth';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { SharedMaterialModule } from '@booking-app/shared-material';

////////////////////////////////////////////////////////////////////////////////
// Stub out the standalone dynamic-form
////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  template: '',
})
class DynamicFormStubComponent {
  @Input() config!: any[];
  @Input() errorMessages!: Record<string, string>;
  @Input() submitLabel!: string;
  @Output() submitted = new EventEmitter<any>();
}

describe('RegisterComponent', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dynamicForm: DynamicFormStubComponent;
  let inFlight$: Subject<RegisterData>;

  const mockRegisterData: RegisterData = {
    id: 123,
    token: 'fake-jwt-token',
  };

  const validFormValue = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'Secret123!',
    confirmPassword: 'Secret123!',
  };

  beforeEach(async () => {
    authSpy = createAuthServiceSpy();
    routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        DynamicFormStubComponent,
        LoadingSpinnerComponent,
        SharedMaterialModule,
      ],
      providers: [
        provideMockAuthService(authSpy),
        provideMockRouter(routerSpy),
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(RegisterComponent, {
        set: {
          imports: [
            CommonModule,
            DynamicFormStubComponent,
            FormErrorComponent,
            LoadingSpinnerComponent,
            SharedMaterialModule,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dynamicForm = getStub(
      fixture,
      DynamicFormStubComponent,
      'dynamic-form missing'
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defines the expected dynamic-form config', () => {
    expect(component.config).toEqual([
      {
        name: 'username',
        label: 'Username',
        placeholder: 'Enter your username',
        validators: [Validators.required, Validators.minLength(3)],
        errorMessages: {
          required: 'Username is required',
          minlength: 'Username must be at least 3 characters',
        },
      },
      {
        name: 'email',
        label: 'Email',
        placeholder: 'Enter your email',
        validators: [Validators.required, Validators.email],
        errorMessages: {
          required: 'Email is required',
          email: 'Invalid email format',
        },
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter a password',
        validators: [Validators.required, Validators.minLength(6)],
        errorMessages: {
          required: 'Password is required',
          minlength: 'Password must be at least 6 characters',
        },
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Repeat your password',
        validators: [Validators.required],
        confirmField: 'password',
        errorMessages: {
          required: 'Please confirm your password',
          passwordMismatch: 'Passwords do not match',
        },
      },
    ]);
  });

  it('should pass config, errorMessages, and submitLabel to dynamic-form', () => {
    expect(dynamicForm.config).toEqual(component.config);
    expect(dynamicForm.errorMessages).toEqual(component.errorMessages);
    expect(dynamicForm.submitLabel).toBe('Register');
  });

  // grouped tests for form submission flows
  describe('when dynamic form submits', () => {
    it('calls AuthService.register and navigates to /profile on success', fakeAsync(() => {
      authSpy.register.and.returnValue(of(mockRegisterData));

      dynamicForm.submitted.emit(validFormValue);
      tick();

      expect(authSpy.register).toHaveBeenCalledOnceWith(validFormValue);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    }));

    it('shows spinner while register() is in flight', fakeAsync(() => {
      inFlight$ = new Subject<RegisterData>();
      authSpy.register.and.returnValue(inFlight$.asObservable());

      dynamicForm.submitted.emit(validFormValue);
      fixture.detectChanges();

      const spinnerCmp = getStub<LoadingSpinnerComponent>(
        fixture,
        LoadingSpinnerComponent,
        'Expected spinner to appear when loading'
      );
      expect(spinnerCmp).toBeTruthy(); // or check spinnerCmp.someInput/prop

      inFlight$.next(mockRegisterData);
      inFlight$.complete();
      tick();
      fixture.detectChanges();

      const goneSpinner = getOptionalStub<LoadingSpinnerComponent>(
        fixture,
        LoadingSpinnerComponent,
        'Spinner should have disappeared after resolve'
      );
      expect(goneSpinner).toBeNull();
    }));

    it('starts with no error and hides FormErrorComponent', () => {
      expect(component.error).toBeNull();

      const errCmp = getOptionalStub<FormErrorComponent>(
        fixture,
        FormErrorComponent,
        'No error component should be rendered initially'
      );
      expect(errCmp).toBeNull();
    });

    it('shows FormErrorComponent on failure', fakeAsync(() => {
      const err = { message: 'Email taken' };
      authSpy.register.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validFormValue);
      tick();
      fixture.detectChanges();

      const errCmp = getStub<FormErrorComponent>(
        fixture,
        FormErrorComponent,
        'FormErrorComponent missing on error'
      );
      expect(errCmp.message).toBe(err.message);
    }));

    it('clears previous error on a successful retry', fakeAsync(() => {
      const err = { message: 'Email taken' };
      authSpy.register.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validFormValue);
      tick();
      fixture.detectChanges();
      expect(component.error).toBe(err.message);

      authSpy.register.and.returnValue(of(mockRegisterData));
      dynamicForm.submitted.emit(validFormValue);
      tick();
      fixture.detectChanges();

      expect(component.error).toBeNull();
    }));
  });
});
