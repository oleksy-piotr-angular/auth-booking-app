import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [],
  template: ` <p>reset-password works!</p> `,
  styles: ``,
})
export class ResetPasswordComponent {
  error: any;
  config: any[] = [];
  errorMessages: Record<string, string> = {};
}
