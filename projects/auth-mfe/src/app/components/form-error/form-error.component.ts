import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedMaterialModule } from '@booking-app/shared-material';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  template: `
    <ng-container *ngIf="displayMessages.length > 0">
      <mat-error
        *ngFor="let msg of displayMessages"
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

  /**
   * Priority 1: if messagesToShow has entries, return unique ones in insertion order
   * Priority 2: if message is set, return [message]
   * Otherwise: return []
   */
  public get displayMessages(): string[] {
    if (this.messagesToShow.length) {
      return Array.from(new Set(this.messagesToShow));
    }
    return this.message ? [this.message] : [];
  }
}
