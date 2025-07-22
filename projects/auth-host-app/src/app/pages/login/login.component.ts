import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: ` <p>login works!</p> `,
  styles: ``,
})
export class LoginComponent {
  onLogin(arg0: { email: string; password: string }) {
    throw new Error('Method not implemented.');
  }
}
