import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;


  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    console.log('Getting current user value');
    const value = this.currentUserSubject.value;
    console.log('Current user subject value:', value);
    return value;
  }

  // Navigate to login page
  navigateToLogin(returnUrl?: string) {
    if (returnUrl) {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
    this.router.navigate(['/auth/login']);
  }

  // Initiate Google login
  loginWithGoogle() {
    const returnUrl = sessionStorage.getItem('returnUrl') || '/';
    sessionStorage.setItem('redirectUrl', returnUrl);
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  updateCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  signup(userData: { name: string; email: string; password: string }) {
    return this.http.post<User>(`${this.apiUrl}/register`, userData)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    console.log('AuthService - Checking login status');
    const user = this.currentUserValue;
    const isLoggedIn = !!user && !!user.token;
    console.log('AuthService - Is logged in:', isLoggedIn);
    return isLoggedIn;
  }

  // Get auth token for API requests
  getAuthToken(): string | null {
    const user = this.currentUserValue;
    return user ? user.token : null;
  }
}
