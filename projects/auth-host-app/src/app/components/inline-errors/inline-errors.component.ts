import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inline-errors',
  standalone: true,
  imports: [],
  template: ``,
})
export class InlineErrorsComponent {
  public control: FormControl<string | null> = new FormControl(null);
  public errorMessages: { [key: string]: string } = {};
}
