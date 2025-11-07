import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  sidebarOpen = false;
  isMobile = false;

  constructor(private auth: AuthService) {}

  menu = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Documents', route: '/upload', icon: '📂' },
    { label: 'ChatBot', route: '/chat', icon: '💬' },
  ];

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768; // md breakpoint
    if (this.isMobile) this.sidebarOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeOnMobile() {
    if (this.isMobile) this.sidebarOpen = false;
  }

  logout() {
    this.auth.logout()
  }
}
