// projects/auth-host-app/src/app/pages/login/login-page.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { AuthService } from '../../services/auth/auth.service';
import { FieldConfig } from '../../models/field-config.model';
import { LoginData } from '../../models/auth.model';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DynamicFormComponent, LoginComponent],
      providers: [{ provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a DynamicFormComponent with username & password fields', () => {
    const dfDE = fixture.debugElement.query(By.directive(DynamicFormComponent));
    expect(dfDE).toBeTruthy();

    const dfComp = dfDE.componentInstance as DynamicFormComponent;
    const names = dfComp.fields.map((f: FieldConfig) => f.name);
    expect(names).toEqual(['username', 'password']);
  });

  it('should call AuthService.login when form is submitted', () => {
    authSpy.login.and.returnValue(of({ id: 42, token: 'abc' }));
    component.onLogin({ email: 'alice@example.com', password: 'secret' });
    expect(authSpy.login).toHaveBeenCalledWith({
      email: 'alice@example.com',
      password: 'secret',
    });
  });
});
