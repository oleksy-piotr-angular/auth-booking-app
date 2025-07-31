import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { ForgotPasswordComponent } from './forgot-password.component';
import {
  createAuthServiceSpy,
  createRouterSpy,
  getStub,
  getOptionalStub,
  provideMockAuthService,
  provideMockRouter,
} from 'testing/test-helpers';
import { AuthService, ForgotPasswordPayload } from '@booking-app/auth';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { FORGOT_PASSWORD_FORM_CONFIG } from './forgot-password.config';

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

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dynamicForm: DynamicFormStubComponent;
  let inFlight$: Subject<any>;

  const validEmail: ForgotPasswordPayload = { email: 'alice@test.com' };
  const successResponse = { message: 'OK' };

  beforeEach(async () => {
    authSpy = createAuthServiceSpy();
    routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent,
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
      .overrideComponent(ForgotPasswordComponent, {
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

    fixture = TestBed.createComponent(ForgotPasswordComponent);
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
    expect(component.config).toEqual(FORGOT_PASSWORD_FORM_CONFIG);
  });

  it('should pass config, errorMessages, and submitLabel to dynamic-form', () => {
    expect(dynamicForm.config).toEqual(component.config);
    expect(dynamicForm.errorMessages).toEqual(component.errorMessages);
    expect(dynamicForm.submitLabel).toBe('Send Reset Link');
  });

  describe('when dynamic form submits', () => {
    it('calls AuthService.forgotPassword and navigates to /login on success', fakeAsync(() => {
      authSpy.forgotPassword.and.returnValue(of(successResponse));

      dynamicForm.submitted.emit(validEmail);
      tick();

      fixture.detectChanges();

      expect(authSpy.forgotPassword).toHaveBeenCalledTimes(1);
      expect(authSpy.forgotPassword).toHaveBeenCalledWith(validEmail);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('shows spinner while request is in flight', fakeAsync(() => {
      inFlight$ = new Subject<any>();
      authSpy.forgotPassword.and.returnValue(inFlight$.asObservable());

      dynamicForm.submitted.emit(validEmail);
      fixture.detectChanges();

      const spinnerCmp = getStub<LoadingSpinnerComponent>(
        fixture,
        LoadingSpinnerComponent,
        'Expected spinner to appear when loading'
      );
      expect(spinnerCmp).toBeTruthy();

      inFlight$.next(successResponse);
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
      const err = { message: 'Email not found' };
      authSpy.forgotPassword.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validEmail);
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
      const err = { message: 'Email not found' };
      authSpy.forgotPassword.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validEmail);
      tick();
      fixture.detectChanges();
      expect(component.error).toBe(err.message);

      authSpy.forgotPassword.and.returnValue(of(successResponse));
      dynamicForm.submitted.emit(validEmail);
      tick();
      fixture.detectChanges();

      expect(component.error).toBeNull();
    }));
  });
});
