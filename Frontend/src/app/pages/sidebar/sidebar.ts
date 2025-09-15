import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
menu = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Documents', route: '/documents', icon: '📂' },
    { label: 'ChatBot', route: '/chat', icon: '💬' },
  ];
}
