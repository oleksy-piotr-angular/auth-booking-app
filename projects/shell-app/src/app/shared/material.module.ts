// material.module.ts
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

const MATERIAL = [
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatTooltipModule,
];

@NgModule({ exports: MATERIAL })
export class MaterialModule {}
