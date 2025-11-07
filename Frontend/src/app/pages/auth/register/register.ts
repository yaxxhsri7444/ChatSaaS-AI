import { Component } from '@angular/core';
import { ApiService } from '../../../service/api';
import { AuthService } from '../../../service/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  form = {
    businessName: '',
    ownerEmail: '',
    password: ''
  };
  loading = false;
  error = '';
  success = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.api.register(this.form).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.token) {
          this.auth.setToken(res.token);
          this.success = 'Registration successful!';
          setTimeout(() => this.router.navigate(['/dashboard']), 1000);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Something went wrong!';
      }
    });
  }
}
