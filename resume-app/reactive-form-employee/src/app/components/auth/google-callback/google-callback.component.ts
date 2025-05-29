import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: '<div class="loading">Processing login...</div>',
  styles: ['.loading { display: flex; justify-content: center; align-items: center; height: 100vh; }']
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Google callback initialized');
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      if (params['token'] && params['user']) {
        try {
          const user = JSON.parse(params['user']);
          console.log('Parsed user:', user);
          // Create user data object with all required fields
          const userData = {
            ...user,
            token: params['token']
          };
          
          // Store user data
          console.log('Storing user data:', userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          this.authService.updateCurrentUser(userData);
          
          // Verify stored data
          const storedUser = localStorage.getItem('currentUser');
          console.log('Stored user data:', storedUser);

          // Get stored redirect URL and template
          // Get stored redirect URL or default to home page
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
          console.log('Stored redirect URL:', redirectUrl);
          
          // Clear stored redirect URL
          sessionStorage.removeItem('redirectUrl');
          
          // Navigate after a small delay to ensure auth state is updated
          setTimeout(() => {
            this.router.navigate([redirectUrl]);
          }, 100);
        } catch (error) {
          console.error('Error processing Google callback:', error);
          console.error('Error details:', error);
          this.router.navigate(['/auth/login']);
        }
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
