import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../services/token/token.service';
import { SharedMaterialModule } from '@booking-app/shared-material';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SharedMaterialModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  title = 'auth-host-app';
  constructor(private tokenService: TokenService, private router: Router) {}

  get isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['login']);
  }
}
