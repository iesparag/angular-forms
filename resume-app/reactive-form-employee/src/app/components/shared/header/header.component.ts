import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header">
      <div class="header-left">
        <a routerLink="/" class="logo">
          <img src="assets/images/logo.svg" alt="Resume Builder">
          <span>Resume Builder</span>
        </a>
      </div>
      <div class="header-right">
        <div class="user-menu" *ngIf="user" (click)="toggleMenu()">
          <div class="user-avatar" [style.background-color]="user && user.photoURL ? 'transparent' : getAvatarColor(user && user.name)">
            <img *ngIf="user && user.photoURL" [src]="user.photoURL" [alt]="user.name">
            <span *ngIf="!user || !user.photoURL" class="initials">{{ getInitials(user && user.name) }}</span>
          </div>
          <span class="user-name">{{ user && user.name || 'User' }}</span>
          <i class="fas fa-chevron-down"></i>
          
          <!-- Dropdown Menu -->
          <div class="dropdown-menu" *ngIf="isMenuOpen">
            <a routerLink="/" class="menu-item">
              <i class="fas fa-home"></i> Home
            </a>
            <a (click)="logout()" class="menu-item">
              <i class="fas fa-sign-out-alt"></i> Logout
            </a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1.5rem;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      height: 60px;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #333;
      font-weight: 600;
      font-size: 1.2rem;
    }

    .logo img {
      height: 32px;
      margin-right: 0.5rem;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .user-menu:hover {
      background-color: #f5f5f5;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .initials {
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .user-name {
      margin-right: 0.5rem;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 0.5rem 0;
      min-width: 180px;
      margin-top: 0.5rem;
      z-index: 1000;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #333;
      text-decoration: none;
      transition: background-color 0.2s;
      cursor: pointer;
    }

    .menu-item:hover {
      background-color: #f5f5f5;
    }

    .menu-item i {
      margin-right: 0.5rem;
      width: 20px;
    }
  `]
})
export class HeaderComponent {
  user: User | null = null;
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(name: string | null | undefined): string {
    if (!name) return '#0066ff';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ];
    return colors[Math.abs(hash) % colors.length];
  }
}
