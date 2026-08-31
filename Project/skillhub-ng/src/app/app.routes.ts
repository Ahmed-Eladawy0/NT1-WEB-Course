import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { UserDashboard } from './components/user-dashboard/user-dashboard';
import { Profile } from './components/profile/profile';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: UserDashboard, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' },
];
