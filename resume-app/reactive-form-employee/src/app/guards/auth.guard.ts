import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    console.log('AuthGuard - Checking if user is logged in');
    const currentUser = localStorage.getItem('currentUser');
    console.log('AuthGuard - Current user:', currentUser);
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard - Is logged in:', isLoggedIn);
    if (isLoggedIn) {
      return true;
    }

    // Not logged in so redirect to login page
    this.router.navigate(['/auth/login']);
    return false;
  }
}
