import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";
import { UsersLogin, AuthResponse, UsersRegister, UserForgotPass, UserResetPass } from "../../shared/models/auth.model";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';
  private readonly router = inject(Router);

  isAuthenticated = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: UsersLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        console.log(response)
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.isAuthenticated.set(true);
        }
      })
    );
  }

  forgotPass(userData: UserForgotPass): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/forgot-password`, userData);
  }

  resetPass(userData: UserResetPass): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password`, userData);
  }

  register(userData: UsersRegister): Observable<any> {
    return this.http.post(`${this.API_URL}/users`, userData);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
    this.isAuthenticated.set(false);
  }
}
