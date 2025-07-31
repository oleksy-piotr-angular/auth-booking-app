import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [],
  template: ` <p>forgot-password works!</p> `,
})
export class ForgotPasswordComponent {
  error: any;
  config: any[] = [];
  errorMessages: Record<string, string> = {};
}
