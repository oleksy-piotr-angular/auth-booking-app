import { Component } from '@angular/core';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [],
  template: ` <p>dynamic-input works!</p> `,
  styles: ``,
})
export class DynamicInputComponent {
  control: any;
  label?: string;
  placeholder?: string;
  type?: string;
}
