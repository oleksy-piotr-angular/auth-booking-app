import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedMaterialModule } from '@booking-app/shared-material';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  template: `<div class="spinner"><mat-spinner color="primary" /></div>`,
  styles: [
    `
      .spinner {
        display: flex;
        justify-content: center;
        padding-top: 16px;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {}
