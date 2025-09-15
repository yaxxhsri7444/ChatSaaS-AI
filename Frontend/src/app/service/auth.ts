import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  tokenKey = 'cs_token';
  constructor(private router: Router) {}

  setToken(token: string) { localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  logout() { localStorage.removeItem(this.tokenKey); this.router.navigate(['/auth/login']); }
}
