import {
  AfterViewInit,
  Component,
  Injector,
  Input,
  forwardRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { InlineErrorsComponent } from '../inline-errors/inline-errors.component';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    InlineErrorsComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true,
    },
  ],
  template: `
    <mat-form-field
      appearance="outline"
      class="dynamic-input"
      [class.mat-form-field-invalid]="showErrorState"
    >
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder || ''"
        [value]="viewValue"
        [disabled]="isDisabled"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      <app-inline-errors
        [control]="formControl"
        [errorMessages]="errorMessages"
      ></app-inline-errors>
    </mat-form-field>
  `,
  styles: ['.dynamic-input { width: 100%; }'],
})
export class DynamicInputComponent
  implements ControlValueAccessor, AfterViewInit
{
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() errorMessages: Record<string, string> = {};

  public formControl: FormControl = new FormControl();
  public viewValue = '';
  public isDisabled = false;

  private onChange: (value: any) => void = () => {};
  public onTouched: () => void = () => {};
  private injector = inject(Injector);

  // ***************************
  // Lifecycle
  // ***************************
  ngAfterViewInit(): void {
    const ngControl = this.getHostControl();
    if (ngControl) {
      ngControl.valueAccessor = this;
      this.formControl = ngControl.control as FormControl;
    }
  }

  // ***************************
  // ControlValueAccessor
  // ***************************
  writeValue(value: any): void {
    this.viewValue = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // ***************************
  // Event Handlers
  // ***************************
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  // ***************************
  // Private Helpers
  // ***************************
  private getHostControl(): NgControl | null {
    return this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });
  }

  // ***************************
  // Computed
  // ***************************
  get showErrorState(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }
}
