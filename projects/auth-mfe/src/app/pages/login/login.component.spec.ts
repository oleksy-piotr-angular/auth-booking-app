import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import {
  createAuthServiceSpy,
  createRouterSpy,
  getStub,
  getOptionalStub,
  provideMockAuthService,
  provideMockRouter,
} from 'testing/test-helpers';
import { AuthService, LoginData } from '@booking-app/auth';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { LOGIN_FORM_CONFIG } from './login.config';

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

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dynamicForm: DynamicFormStubComponent;
  let inFlight$: Subject<LoginData>;

  const mockLoginData: LoginData = { id: 1, token: 'fake-jwt-token' };
  const validCreds = { email: 'alice@test.com', password: 'Secret123!' };

  beforeEach(async () => {
    authSpy = createAuthServiceSpy();
    routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
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
      .overrideComponent(LoginComponent, {
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

    fixture = TestBed.createComponent(LoginComponent);
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
    expect(component.config).toEqual(LOGIN_FORM_CONFIG);
  });

  it('should pass config, errorMessages, and submitLabel to dynamic-form', () => {
    expect(dynamicForm.config).toEqual(component.config);
    expect(dynamicForm.errorMessages).toEqual(component.errorMessages);
    expect(dynamicForm.submitLabel).toBe('Login');
  });

  describe('when dynamic form submits', () => {
    it('calls AuthService.login and navigates to /profile on success', fakeAsync(() => {
      authSpy.login.and.returnValue(of(mockLoginData));

      dynamicForm.submitted.emit(validCreds);
      tick();

      expect(authSpy.login).toHaveBeenCalledOnceWith(validCreds);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    }));

    it('shows spinner while login() is in flight', fakeAsync(() => {
      inFlight$ = new Subject<LoginData>();
      authSpy.login.and.returnValue(inFlight$.asObservable());

      dynamicForm.submitted.emit(validCreds);
      fixture.detectChanges();

      const spinnerCmp = getStub<LoadingSpinnerComponent>(
        fixture,
        LoadingSpinnerComponent,
        'Expected spinner to appear when loading'
      );
      expect(spinnerCmp).toBeTruthy();

      inFlight$.next(mockLoginData);
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
      const err = { message: 'Invalid credentials' };
      authSpy.login.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validCreds);
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
      const err = { message: 'Invalid credentials' };
      authSpy.login.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validCreds);
      tick();
      fixture.detectChanges();
      expect(component.error).toBe(err.message);

      authSpy.login.and.returnValue(of(mockLoginData));
      dynamicForm.submitted.emit(validCreds);
      tick();
      fixture.detectChanges();

      expect(component.error).toBeNull();
    }));
  });
});