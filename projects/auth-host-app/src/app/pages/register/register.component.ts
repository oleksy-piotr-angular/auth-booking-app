import { Component } from '@angular/core';
import { FormFieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  template: ` <p>register works!</p> `,
  styles: ``,
})
export class RegisterComponent {
  formConfig: FormFieldConfig[] = [];
  onSubmit(formData: any): void {
    throw new Error('Method not implemented.');
  }
}
