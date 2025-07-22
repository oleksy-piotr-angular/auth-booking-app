// projects/auth-host-app/src/app/pages/register/register.component.spec.ts
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterData, LoginData } from '../../models/auth.model';
import { RegisterPayload } from '../../dtos/auth.dto';

describe('RegisterComponent (TDD)', () => {
  let fixture: ComponentFixture<RegisterComponent>;
  let component: RegisterComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['register']);
    // our mock server returns id & token, tests only care that register() was called
    authSpy.register.and.returnValue(
      of({ id: 42, token: 'tkn' } as RegisterData)
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        DynamicFormComponent,
        FormErrorComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([]),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the RegisterComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should pass name, email & password to AuthService.register()', () => {
    const dyn = fixture.debugElement.query(By.directive(DynamicFormComponent))
      .componentInstance as DynamicFormComponent;

    const formValue: any = {
      name: 'Test User',
      email: 'x@y.com',
      password: 'secret1',
      confirmPassword: 'secret1',
    };

    dyn.submitForm.emit(formValue);

    expect(authSpy.register).toHaveBeenCalledOnceWith({
      name: 'Test User',
      email: 'x@y.com',
      password: 'secret1',
    });
  });

  it('should not call register() if passwords do not match', () => {
    const badValue = {
      name: 'Test User',
      email: 'x@y.com',
      password: 'abc123',
      confirmPassword: 'xyz789',
    };

    component.onRegister(badValue);
    fixture.detectChanges();

    expect(authSpy.register).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Passwords do not match'
    );
  });

  it('should show passwordMismatch error under confirmPassword', fakeAsync(() => {
    const dynDE = fixture.debugElement.query(
      By.directive(DynamicFormComponent)
    );
    const dynCmp = dynDE.componentInstance as DynamicFormComponent;

    dynCmp.form.setValue({
      name: 'Test User',
      email: 'x@y.com',
      password: '123456',
      confirmPassword: '654321',
    });
    dynCmp.form.markAllAsTouched();
    fixture.detectChanges();
    tick();

    const matError =
      fixture.nativeElement.querySelector('mat-error').textContent!;
    expect(matError).toContain('Passwords do not match');
  }));

  it('should auto-login and redirect to Profile on successful register', () => {
    const dyn = fixture.debugElement.query(By.directive(DynamicFormComponent))
      .componentInstance as DynamicFormComponent;

    const formValue = {
      name: 'Test User',
      email: 'x@y.com',
      password: 'secret1',
      confirmPassword: 'secret1',
    };

    dyn.submitForm.emit(formValue);

    expect(authSpy.register).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'x@y.com',
      password: 'secret1',
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/profile']);
  });
});
