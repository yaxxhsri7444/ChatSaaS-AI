import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../service/auth';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  badge?: number; // Optional notification badge
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  sidebarOpen = true; // Desktop default: open
  isMobile = false;
  currentUser: string = '';
  private routerSubscription?: Subscription;

  menu: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Documents', route: '/upload', icon: '📂' },
    { label: 'ChatBot', route: '/chat', icon: '💬' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkScreen();
    this.loadUserInfo();
    
    // Close sidebar on mobile when route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeOnMobile();
      });
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768; // md breakpoint
    
    // Auto-adjust sidebar based on screen size
    if (this.isMobile && !wasMobile) {
      this.sidebarOpen = false; // Close when switching to mobile
    } else if (!this.isMobile && wasMobile) {
      this.sidebarOpen = true; // Open when switching to desktop
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeOnMobile() {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  loadUserInfo() {
    // Get user email or name if available
    const userEmail = this.auth.getEmail();
    if (userEmail) {
      this.currentUser = userEmail;
    }
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  // Helper to get initials for avatar
  getUserInitials(): string {
    if (!this.currentUser) return '👤';
    const parts = this.currentUser.split(/[@\s]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return this.currentUser.substring(0, 2).toUpperCase();
  }
}