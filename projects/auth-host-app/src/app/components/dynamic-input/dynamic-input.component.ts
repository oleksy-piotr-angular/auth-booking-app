// projects/auth-host-app/src/app/shared/dynamic-form/dynamic-input/dynamic-input.component.ts

import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '@booking-app/shared-material';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
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
    SharedMaterialModule,
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
    <mat-form-field appearance="outline" class="dynamic-input">
      <mat-label *ngIf="label">{{ label }}</mat-label>
      <input
        matInput
        [type]="type"
        [placeholder]="placeholder ?? ''"
        [formControl]="control"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />
      <app-inline-errors
        [control]="control"
        [errorMessages]="errorMessages"
      ></app-inline-errors>
    </mat-form-field>
  `,
  styles: [
    `
      .dynamic-input {
        width: 100%;
      }
    `,
  ],
})
export class DynamicInputComponent implements ControlValueAccessor {
  @Input() control!: FormControl;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() errorMessages: Record<string, string> = {};

  // CVA callbacks
  public onTouched: () => void = () => {};
  private onChange: (value: any) => void = () => {};

  writeValue(value: any): void {
    // sync value to FormControl for direct-binding scenario
    if (this.control) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    // propagate FormControl valueChanges to CVA for formControlName
    this.control.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.control) {
      isDisabled
        ? this.control.disable({ emitEvent: false })
        : this.control.enable({ emitEvent: false });
    }
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }
}
