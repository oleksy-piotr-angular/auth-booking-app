import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import {
  createAuthServiceSpy,
  createRouterSpy,
  getStub,
  provideMockAuthService,
  provideMockRouter,
} from 'testing/test-helpers';
import { AuthService, RegisterData } from '@booking-app/auth';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

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
      imports: [RegisterComponent, DynamicFormStubComponent],
      providers: [
        provideMockAuthService(authSpy),
        provideMockRouter(routerSpy),
        provideNoopAnimations(),
      ],
    })
      .overrideComponent(RegisterComponent, {
        set: {
          imports: [CommonModule, DynamicFormStubComponent, FormErrorComponent],
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

  it('should pass config, errorMessages, and submitLabel to dynamic-form', () => {
    expect(dynamicForm.config).toEqual(component.config);
    expect(dynamicForm.errorMessages).toEqual(component.errorMessages);
    expect(dynamicForm.submitLabel).toBe('Register');
  });

  // grouped tests for form submission flows
  describe('when dynamic form submits', () => {
    it('calls AuthService.register and navigates to /login on success', fakeAsync(() => {
      authSpy.register.and.returnValue(of(mockRegisterData));

      dynamicForm.submitted.emit(validFormValue);
      tick();

      expect(authSpy.register).toHaveBeenCalledOnceWith(validFormValue);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    }));

    it('sets error and shows FormErrorComponent on failure', fakeAsync(() => {
      const err = { message: 'Email taken' };
      authSpy.register.and.returnValue(throwError(() => err));

      dynamicForm.submitted.emit(validFormValue);
      tick();
      fixture.detectChanges();

      expect(component.error).toBe(err.message);

      const errCmp = getStub<FormErrorComponent>(
        fixture,
        FormErrorComponent,
        'FormErrorComponent missing'
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
