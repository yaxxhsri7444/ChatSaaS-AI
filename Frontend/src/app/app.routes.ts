import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { ChatBoard } from './pages/chats/chat-board/chat-board';
import { Upload } from './pages/upload/upload';
import { Widget } from './pages/chats/widget/widget';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatBoard, canActivate: [AuthGuard] },
  { path: 'upload', component: Upload, canActivate: [AuthGuard] },
  { path: 'widget', component: Widget },

  { path: '**', redirectTo: '/login' },
];
