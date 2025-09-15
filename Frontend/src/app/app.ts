import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./pages/sidebar/sidebar";
import { Navbar } from "./pages/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  template: `
    <div [class.dark]="darkMode" class="min-h-screen">
      <button (click)="toggleTheme()" class="fixed top-4 right-4 z-50 bg-indigo-600 dark:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow">
        {{ darkMode ? '🌞 Light' : '🌙 Dark' }}
      </button>
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {
  darkmode= false;

  toggleTheme(){
    this.darkmode = !this.darkmode;
  }
}
