import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: '',
  styles: [],
})
export class LoginComponent {
  form: FormGroup;
  error: any;
  config: any;
  errorMessages: Record<string, string> = {};

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    // to be implemented
  }
}
