import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { SharedMaterialModule } from '@booking-app/shared-material';

@Component({
  selector: 'app-inline-errors',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule],
  template: `<ng-container *ngIf="errorKeys.length">
    <mat-error *ngFor="let key of errorKeys">
      {{ errorMessages[key] }}
    </mat-error>
  </ng-container>`,
})
export class InlineErrorsComponent {
  @Input() public control!: AbstractControl;
  @Input() public errorMessages: Record<string, string> = {};

  public get errorKeys(): string[] {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return [];
    }
    // only show keys that have messages for
    return Object.keys(this.control.errors).filter(
      (key) => key in this.errorMessages
    );
  }
}
