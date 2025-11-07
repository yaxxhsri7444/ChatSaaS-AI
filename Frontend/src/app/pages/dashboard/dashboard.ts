import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  loading = false;
  stats: any = {
    totalChats: 0,
    uniqueUsers: 0,
    topQuestion: '',
    avgRating: 0,
  };

  constructor(private api: ApiService, private auth : AuthService) {}

  ngOnInit() {
  const businessId = this.auth.getBusinessId();
  if (businessId) {
    this.fetchAnalytics(businessId);
  } else {
    console.error('No businessId found in localStorage');
  }
}


   fetchAnalytics(businessId: string) {
    this.loading = true;
    this.api.analytics(businessId).subscribe({
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
