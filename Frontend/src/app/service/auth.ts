import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private TOKEN_KEY = 'token';
  private BUSINESS_ID_KEY = 'businessId';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setBusinessId(id: string) {
    localStorage.setItem(this.BUSINESS_ID_KEY, id);
  }

  getBusinessId(): string | null {
    return localStorage.getItem(this.BUSINESS_ID_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.BUSINESS_ID_KEY);
  }
}
