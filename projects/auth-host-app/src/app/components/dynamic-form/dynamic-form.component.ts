import { Component } from '@angular/core';
import { DynamicInputComponent } from '../dynamic-input/dynamic-input.component';
import { FieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {}
