import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs'; 
import { API_BASE } from '../utils';
import { ApiResponse, User } from '../models/models';
import { jwtDecode } from 'jwt-decode'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.readStoredUser());
  readonly token = signal<string | null>(localStorage.getItem('token'));

  private http = inject(HttpClient);
  private router = inject(Router);

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const currentToken = this.token();
    
    if (!currentToken) {
      return false;
    }

    try {
      const decoded = jwtDecode<any>(currentToken);
      const expirationDate = new Date(decoded.exp * 1000);

      if (expirationDate < new Date()) {
        this.clearSession(); 
        return false;
      }

      return !!this.user();
    } catch {
      this.clearSession(); 
      return false;
    }
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

  login(email: string, password: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(`${API_BASE}/auth/login`, { email, password }).pipe(
      tap(data => {
        if (data.status === 'success' && data.data) {
          this.setSession(data.token ?? null, data.data.user);
        }
      })
    );
  }

  signup(formData: FormData): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(`${API_BASE}/auth/signup`, formData).pipe(
      tap(data => {
        if (data.status === 'success' && data.data) {
          this.setSession(data.token ?? null, data.data.user);
        }
      })
    );
  }

  refreshProfile(): Observable<User | null> {
    return this.http.get<ApiResponse<{ user: User }>>(`${API_BASE}/auth/profile`).pipe(
      tap(data => {
        if (data.status === 'success' && data.data) {
          this.setSession(null, data.data.user);
        }
      }),
      map(data => data.status === 'success' && data.data ? data.data.user : null) 
    );
  }

  updateProfile(formData: FormData): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(`${API_BASE}/auth/profile`, formData).pipe(
      tap(data => {
        if (data.status === 'success' && data.data) {
          this.setSession(null, data.data.user);
        }
      })
    );
  }

  enroll(courseId: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(`${API_BASE}/auth/enroll`, { courseId });
  }

  /* ---- admin-only user management ---- */
  getAllUsers(): Observable<ApiResponse<{ users: User[] }>> {
    return this.http.get<ApiResponse<{ users: User[] }>>(`${API_BASE}/auth/users`);
  }

  toggleUserRole(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(`${API_BASE}/auth/users/${id}/role`, {});
  }

  deleteUser(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${API_BASE}/auth/users/${id}`);
  }
}