// reset-password.component.spec.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService, ResetPasswordPayload } from '@booking-app/auth';
import {
  createAuthServiceSpy,
  createRouterSpy,
  getStub,
  getOptionalStub,
  provideMockAuthService,
  provideMockRouter,
} from 'testing/test-helpers';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { RESET_PASSWORD_FORM_CONFIG } from './reset-password.config';

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

describe('ResetPasswordComponent', () => {
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let component: ResetPasswordComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dynamicForm: DynamicFormStubComponent;
  let inFlight$: Subject<any>;

  const validPayload: ResetPasswordPayload = {
    token: 'abc123',
    newPassword: 'newPass!23',
    confirmPassword: 'newPass!23',
  };
  const successResponse = { message: 'Password updated' };

  beforeEach(async () => {
    authSpy = createAuthServiceSpy();
    routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
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
      .overrideComponent(ResetPasswordComponent, {
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

    fixture = TestBed.createComponent(ResetPasswordComponent);
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

  it('defines the expected form config', () => {
    expect(component.config).toEqual(RESET_PASSWORD_FORM_CONFIG);
  });

  it('passes config, errorMessages, and submitLabel to dynamic-form', () => {
    expect(dynamicForm.config).toEqual(component.config);
    expect(dynamicForm.errorMessages).toEqual(component.errorMessages);
    expect(dynamicForm.submitLabel).toBe('Reset Password');
  });

  describe('when dynamic form submits', () => {
    it('calls AuthService.resetPassword and navigates to /login on success', fakeAsync(() => {
      authSpy.resetPassword.and.returnValue(of(successResponse));

      dynamicForm.submitted.emit(validPayload);
      tick();
      fixture.detectChanges();

      expect(authSpy.resetPassword).toHaveBeenCalledTimes(1);
      expect(authSpy.resetPassword).toHaveBeenCalledWith(validPayload);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('shows spinner while request is in flight', fakeAsync(() => {
      inFlight$ = new Subject<any>();
      authSpy.resetPassword.and.returnValue(inFlight$.asObservable());

      dynamicForm.submitted.emit(validPayload);
      fixture.detectChanges();

      const spinnerCmp = getStub<LoadingSpinnerComponent>(
        fixture,
        LoadingSpinnerComponent,
        'Expected spinner while loading'
      );
      expect(spinnerCmp).toBeTruthy();

      inFlight$.next(successResponse);
      inFlight$.complete();
      tick();
      fixture.detectChanges();

      const goneSpinner = getOptionalStub<LoadingSpinnerComponent>(
        fixture,
        LoadingSpinnerComponent,
        'Spinner should disappear after resolve'
      );
      expect(goneSpinner).toBeNull();
    }));

    it('starts with no error and hides FormErrorComponent', () => {
      expect(component.error).toBeNull();
      const errCmp = getOptionalStub<FormErrorComponent>(
        fixture,
        FormErrorComponent,
        'No error component initially'
      );
      expect(errCmp).toBeNull();
    });

    it('shows FormErrorComponent on failure', fakeAsync(() => {
      const err = { message: 'Invalid token' };
      authSpy.resetPassword.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validPayload);
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
      const err = { message: 'Invalid token' };
      authSpy.resetPassword.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validPayload);
      tick();
      fixture.detectChanges();
      expect(component.error).toBe(err.message);

      authSpy.resetPassword.and.returnValue(of(successResponse));
      dynamicForm.submitted.emit(validPayload);
      tick();
      fixture.detectChanges();

      expect(component.error).toBeNull();
    }));
  });
});
