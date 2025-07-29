// projects/auth-mfe/src/app/pages/register/register.component.spec.ts

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
  provideMockAuthService,
  provideMockRouter,
} from 'testing/test-helpers';
import { AuthService, RegisterData } from '@booking-app/auth';

////////////////////////////////////////////////////////////////////////////////
// Stub out the standalone dynamic-form
////////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-dynamic-form',
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
      declarations: [RegisterComponent, DynamicFormStubComponent],
      providers: [
        provideMockAuthService(authSpy),
        provideMockRouter(routerSpy),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass the correct config to the dynamic form', () => {
    const dynamicForm = fixture.debugElement.query(
      (d) => d.componentInstance instanceof DynamicFormStubComponent
    ).componentInstance as DynamicFormStubComponent;

    expect(dynamicForm.config).toEqual(component.config);
    expect(dynamicForm.submitLabel).toBe('Register');
  });

  it('calls AuthService.register with payload when dynamic-form emits', fakeAsync(() => {
    authSpy.register.and.returnValue(of(mockRegisterData));

    const dynamicForm = fixture.debugElement.query(
      (d) => d.componentInstance instanceof DynamicFormStubComponent
    ).componentInstance as DynamicFormStubComponent;

    dynamicForm.submitted.emit(validFormValue);
    tick();

    expect(authSpy.register).toHaveBeenCalledOnceWith(validFormValue);
  }));

  it('navigates to /login on success', fakeAsync(() => {
    authSpy.register.and.returnValue(of(mockRegisterData));

    const dynamicForm = fixture.debugElement.query(
      (d) => d.componentInstance instanceof DynamicFormStubComponent
    ).componentInstance as DynamicFormStubComponent;

    dynamicForm.submitted.emit(validFormValue);
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('displays error on failure', fakeAsync(() => {
    const err = { message: 'Email taken' };
    authSpy.register.and.returnValue(throwError(() => err));

    const dynamicForm = fixture.debugElement.query(
      (d) => d.componentInstance instanceof DynamicFormStubComponent
    ).componentInstance as DynamicFormStubComponent;

    dynamicForm.submitted.emit(validFormValue);
    tick();
    fixture.detectChanges();

    expect(component.error).toBe(err.message);
    const errorEl = fixture.nativeElement.querySelector('.error');
    expect(errorEl.textContent).toContain(err.message);
  }));
});
