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
        color: #f44336; /* Material “warn” red */
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() message: string | null = null;
  @Input() messages?: string[];

  /** Collects either `messages` or the single `message`, then dedupes */
  get messagesToShow(): string[] {
    const list = this.messages ?? (this.message != null ? [this.message] : []);
    return Array.from(new Set(list));
  }
}
