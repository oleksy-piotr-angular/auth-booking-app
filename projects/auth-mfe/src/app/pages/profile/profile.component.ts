import { Component, OnInit } from '@angular/core';
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
      <!-- more fields… -->
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
  user?: UserProfileData;
  error?: string;
  loading = true;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (u) => {
        this.user = u;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message || 'Failed to load profile';
        this.loading = false;
      },
    });
  }
}
