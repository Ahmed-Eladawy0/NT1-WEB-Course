import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../utils';
import { ApiResponse, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.readStoredUser());
  readonly token = signal<string | null>(localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.token() && !!this.user();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'admin';
  }

  setSession(token: string | null, user: User | null): void {
    if (token) {
      localStorage.setItem('token', token);
      this.token.set(token);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.user.set(user);
    }
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    this.user.set(null);
  }

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/login');
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    const data = await firstValueFrom(
      this.http.post<ApiResponse<{ user: User }>>(`${API_BASE}/auth/login`, { email, password })
    );
    if (data.status === 'success' && data.data) {
      this.setSession(data.token ?? null, data.data.user);
    }
    return data;
  }

  async signup(formData: FormData): Promise<ApiResponse<{ user: User }>> {
    const data = await firstValueFrom(
      this.http.post<ApiResponse<{ user: User }>>(`${API_BASE}/auth/signup`, formData)
    );
    if (data.status === 'success' && data.data) {
      this.setSession(data.token ?? null, data.data.user);
    }
    return data;
  }

  async refreshProfile(): Promise<User | null> {
    const data = await firstValueFrom(this.http.get<ApiResponse<{ user: User }>>(`${API_BASE}/auth/profile`));
    if (data.status === 'success' && data.data) {
      this.setSession(null, data.data.user);
      return data.data.user;
    }
    return null;
  }

  async updateProfile(formData: FormData): Promise<ApiResponse<{ user: User }>> {
    const data = await firstValueFrom(
      this.http.patch<ApiResponse<{ user: User }>>(`${API_BASE}/auth/profile`, formData)
    );
    if (data.status === 'success' && data.data) {
      this.setSession(null, data.data.user);
    }
    return data;
  }

  async enroll(courseId: string): Promise<ApiResponse<{ user: User }>> {
    return firstValueFrom(
      this.http.post<ApiResponse<{ user: User }>>(`${API_BASE}/auth/enroll`, { courseId })
    );
  }

  /* ---- admin-only user management ---- */
  async getAllUsers(): Promise<ApiResponse<{ users: User[] }>> {
    return firstValueFrom(this.http.get<ApiResponse<{ users: User[] }>>(`${API_BASE}/auth/users`));
  }

  async toggleUserRole(id: string): Promise<ApiResponse<{ user: User }>> {
    return firstValueFrom(this.http.patch<ApiResponse<{ user: User }>>(`${API_BASE}/auth/users/${id}/role`, {}));
  }

  async deleteUser(id: string): Promise<ApiResponse> {
    return firstValueFrom(this.http.delete<ApiResponse>(`${API_BASE}/auth/users/${id}`));
  }
}
