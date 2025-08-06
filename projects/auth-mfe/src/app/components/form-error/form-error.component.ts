import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedMaterialModule } from '@booking-app/shared-material';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  template: `
    <ng-container *ngIf="messagesToShow.length > 0">
      <mat-error
        *ngFor="let msg of messagesToShow"
        class="form-error-message"
        role="alert"
      >
        {{ msg }}
      </mat-error>
    </ng-container>
  `,
  styles: [
    `
      .form-error-message {
        margin-top: 4px;
        color: #f44336;
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() public message?: string;
  @Input() public messagesToShow: string[] = [];
}
