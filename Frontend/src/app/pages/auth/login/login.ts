import { Component } from '@angular/core';
import { ApiService } from '../../../service/api';
import { AuthService } from '../../../service/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  login(): void {
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Email and password required';
      return;
    }

    this.loading = true;
    this.api.login({ ownerEmail: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;

        this.auth.setToken(res.token);

        if (res.business?.id) {
          this.auth.setBusinessId(res.business.id);
        } else if (res.businessId) {
          this.auth.setBusinessId(res.businessId);
        } else if (res.ownerId) {
          this.auth.setBusinessId(res.ownerId); // fallback
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.error || 'Login failed';
      },
    });
  }
}
