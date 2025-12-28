import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../service/api';
import { CommonModule } from '@angular/common';

interface DashboardStats {
  totalChats: number;
  uniqueUsers: number;
  topQuestion: string;
  avgRating: number;
  totalDocuments?: number;
  avgResponseTime?: string;
  successRate?: number;
}

interface RecentChat {
  userMsg: string;
  createdAt: Date;
  intent?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  loading = false;
  error: string | null = null;
  
  stats: DashboardStats = {
    totalChats: 0,
    uniqueUsers: 0,
    topQuestion: 'No questions yet',
    avgRating: 0,
    totalDocuments: 0,
    avgResponseTime: '0',
    successRate: 0,
  };

  recentChats: RecentChat[] = [];

  constructor(
    private api: ApiService, 
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const businessId = this.auth.getBusinessId();
    
    if (!businessId) {
      console.error('No businessId found - redirecting to login');
      this.error = 'Authentication required';
      this.router.navigate(['/login']);
      return;
    }
    
    this.fetchAnalytics(businessId);
  }

  fetchAnalytics(businessId: string) {
    this.loading = true;
    this.error = null;

    this.api.analytics(businessId).subscribe({
      next: (res: any) => {
        this.loading = false;
        
        if (res) {
          this.stats = {
            totalChats: res.totalChats || 0,
            uniqueUsers: res.uniqueUsers || 0,
            topQuestion: res.topQuestion || 'No questions yet',
            avgRating: res.avgRating || 0,
            totalDocuments: res.totalDocuments || 0,
            avgResponseTime: res.avgResponseTime || '1.2',
            successRate: res.successRate || 95,
          };
          
          // If recent chats are included in response
          if (res.recentChats) {
            this.recentChats = res.recentChats;
          }
        }
        
        console.log('✅ Analytics loaded:', this.stats);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Analytics fetch failed:', err);
        
        // Set user-friendly error message
        if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.status === 403) {
          this.error = 'Access denied. Please check your permissions.';
        } else if (err.status === 404) {
          this.error = 'Analytics endpoint not found.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to server. Please check your connection.';
        } else {
          this.error = err.error?.error || 'Failed to load dashboard data. Please try again.';
        }
      }
    });
  }

  refreshStats() {
    const businessId = this.auth.getBusinessId();
    if (businessId) {
      this.fetchAnalytics(businessId);
    }
  }

  // Helper method to check if data is loaded and valid
  hasData(): boolean {
    return !this.loading && !this.error && this.stats.totalChats >= 0;
  }
}