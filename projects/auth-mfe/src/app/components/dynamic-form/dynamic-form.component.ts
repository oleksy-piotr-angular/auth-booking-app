import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { passwordsMatchValidator } from '../../Validators/password-match/passwords-match.validator';
import { FormFieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    DynamicInputComponent,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent<T = any> implements OnInit, OnChanges {
  @Input() config: FormFieldConfig[] = [];
  @Input() errorMessages: Record<string, string> = {};
  @Input() submitLabel = 'Submit';

  @Output() submitted = new EventEmitter<T>();

  public form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    const controls: Record<string, any> = {};

    this.config.forEach((field) => {
      controls[field.name] = [null, field.validators || []];
    });

    this.form = this.fb.group(controls);

    this.config.forEach((field) => {
      if (field.confirmField) {
        const pwdCtrl = this.form.get(field.confirmField)!;
        const cpCtrl = this.form.get(field.name)!;

        cpCtrl.setValidators([
          ...(field.validators || []),
          passwordsMatchValidator(field.confirmField, field.name),
        ]);

        cpCtrl.updateValueAndValidity();
        pwdCtrl.valueChanges.subscribe(() => cpCtrl.updateValueAndValidity());
      }
    });

    this.form.updateValueAndValidity();
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.submitted.emit(this.form.value as T);
    }
  }

  public trackByName(_: number, field: FormFieldConfig): string {
    return field.name;
  }
}
