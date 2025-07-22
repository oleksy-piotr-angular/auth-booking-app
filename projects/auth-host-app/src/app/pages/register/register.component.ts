import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  template: ` <p>register works!</p> `,
  styles: ``,
})
export class RegisterComponent {
  onRegister(badValue: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    throw new Error('Method not implemented.');
  }
}
