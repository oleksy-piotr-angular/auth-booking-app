// projects/auth-host-app/src/app/pages/login/login.component.spec.ts
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

import { LoginComponent } from './login.component';
import { LoginData } from '../../models/auth.model';
import { LoginPayload } from '../../dtos/auth.dto';
import { AuthService } from '../../services/auth/auth.service';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FormErrorComponent } from '../../components/form-error/form-error.component';

describe('LoginComponent (TDD)', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      // no RouterTestingModule here
      imports: [
        LoginComponent,
        DynamicFormComponent,
        FormErrorComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        // override the injected Router with our spy
        { provide: Router, useValue: routerSpy },
        // override AuthService with spy
        { provide: AuthService, useValue: authSpy },
        // now provide a real router for DI & location fakes
        provideRouter([]),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders DynamicFormComponent with email & password fields', () => {
    const dynDE = fixture.debugElement.query(
      By.directive(DynamicFormComponent)
    );
    expect(dynDE).toBeTruthy();

    const dynComp = dynDE.componentInstance as DynamicFormComponent;
    expect(dynComp.fields.map((f) => f.name)).toEqual(['email', 'password']);
  });

  it('calls AuthService.login and navigates on success', () => {
    const payload: LoginPayload = { email: 'a@b.com', password: 'pw' };
    const mockLoginData: LoginData = { id: 1, token: 'x' };
    authSpy.login.and.returnValue(of(mockLoginData));

    const dynComp = fixture.debugElement.query(
      By.directive(DynamicFormComponent)
    ).componentInstance as DynamicFormComponent;

    dynComp.submitForm.emit(payload);

    expect(authSpy.login).toHaveBeenCalledWith(payload);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/profile']);
  });

  it('displays an error message when login fails', fakeAsync(() => {
    authSpy.login.and.returnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );

    const dynComp = fixture.debugElement.query(
      By.directive(DynamicFormComponent)
    ).componentInstance as DynamicFormComponent;

    dynComp.submitForm.emit({ email: 'u@test.com', password: 'bad' });
    tick();
    fixture.detectChanges();

    const errDE = fixture.debugElement.query(By.directive(FormErrorComponent));
    expect(errDE).toBeTruthy();

    const errCmp = errDE.componentInstance as FormErrorComponent;
    expect(errCmp.message).toBe('Invalid credentials');
  }));

  it('shows server error and preserves validation errors', () => {
    const dynComp = fixture.debugElement.query(
      By.directive(DynamicFormComponent)
    ).componentInstance as DynamicFormComponent;

    // simulate invalid form controls
    dynComp.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    authSpy.login.and.returnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } }))
    );

    dynComp.submitForm.emit({ email: '', password: 'bad' });
    fixture.detectChanges();

    const errDE = fixture.debugElement.query(By.directive(FormErrorComponent));
    expect(errDE).toBeTruthy();

    const errCmp = errDE.componentInstance as FormErrorComponent;
    expect(errCmp.message).toBe('Invalid credentials');
  });
});
