// projects/auth-host-app/src/app/components/dynamic-form/dynamic-form.component.ts

import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { FieldConfig } from '../../models/field-config.model';

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
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Output() submitForm = new EventEmitter<any>();

  public form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    const group: Record<string, FormControl> = {};
    this.fields.forEach((f) => {
      group[f.name] = new FormControl(null, f.validators ?? []);
    });
    this.form = new FormGroup(group);
  }

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  trackByName(_: number, f: FieldConfig) {
    return f.name;
  }

  onSubmit(): void {
    this.submitForm.emit(this.form.value);
  }
}
