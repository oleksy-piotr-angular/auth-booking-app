import { Component, inject } from '@angular/core';
import { DynamicFormComponent } from '../../components/dynamic-form/dynamic-form.component';
import { FieldConfig } from '../../models/field-config.model';
import { AuthService } from '../../services/auth/auth.service';
import { LoginPayload } from '../../dtos/auth.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DynamicFormComponent],
  template: ` <app-dynamic-form
    [fields]="fields"
    (submitForm)="onLogin($event)"
  ></app-dynamic-form>`,
  styles: ``,
})
export class LoginComponent {
  private auth: AuthService = inject(AuthService);

  public fields: FieldConfig[] = [
    {
      name: 'username',
      label: 'Username',
      placeholder: 'Enter username',
      validators: [], // will add Validators later
      errorMessages: {},
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validators: [],
      errorMessages: {},
    },
  ];

  public onLogin(credentials: LoginPayload): void {
    this.auth.login(credentials).subscribe();
  }
}
