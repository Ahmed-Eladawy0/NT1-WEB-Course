import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../utils';
import { ApiResponse, Course } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);

  getAll(): Observable<ApiResponse<{ courses: Course[] }>> {
    return this.http.get<ApiResponse<{ courses: Course[] }>>(`${API_BASE}/courses`);
  }

  getById(id: string): Observable<ApiResponse<{ course: Course }>> {
    return this.http.get<ApiResponse<{ course: Course }>>(`${API_BASE}/courses/${id}`);
  }

  create(formData: FormData): Observable<ApiResponse<{ course: Course }>> {
    return this.http.post<ApiResponse<{ course: Course }>>(`${API_BASE}/courses`, formData);
  }

  update(id: string, formData: FormData): Observable<ApiResponse<{ course: Course }>> {
    return this.http.patch<ApiResponse<{ course: Course }>>(`${API_BASE}/courses/${id}`, formData);
  }

  remove(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${API_BASE}/courses/${id}`);
  }
}