import { Component, inject, OnInit } from '@angular/core';
import { AuthService, UserProfileData } from '@booking-app/auth';
import { LoadingSpinnerComponent } from '@booking-app/ui-lib-components';
import { FormErrorComponent } from '../../components/form-error/form-error.component';
import { SharedMaterialModule } from '@booking-app/shared-material';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  template: `<app-loading-spinner *ngIf="loading"></app-loading-spinner>
    <app-form-error *ngIf="error" [message]="error"></app-form-error>
    <div *ngIf="user" class="profile-details">
      <h2 class="profile-name">{{ user.name }}</h2>
      <p class="profile-email">{{ user.email }}</p>
    </div>`,
  styles: [],
  standalone: true,
  imports: [
    CommonModule,
    SharedMaterialModule,
    FormErrorComponent,
    LoadingSpinnerComponent,
  ],
})
export class ProfileComponent implements OnInit {
  public loading = false;
  public error: string | null = null;
  public user: UserProfileData | null = null;

  private readonly authService = inject(AuthService);

  public ngOnInit(): void {
    this.loading = true;
    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load profile';
        this.loading = false;
      },
    });
  }
}
