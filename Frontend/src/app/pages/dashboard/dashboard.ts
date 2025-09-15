import { Component } from '@angular/core';
import { AuthService } from '../../service/auth';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
   loading = false;
  stats: any = {
    totalChats: 0,
    uniqueUsers: 0,
    topQuestion: '',
    avgRating: 0
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchAnalytics();
  }

  fetchAnalytics() {
    this.loading = true;
    this.api.analytics().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.stats = res || this.stats;
      },
      error: (err) => {
        this.loading = false;
        console.error('Analytics fetch failed', err);
      }
    });
  }

}
