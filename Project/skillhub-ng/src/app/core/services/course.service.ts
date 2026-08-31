import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_BASE } from '../utils';
import { ApiResponse, Course } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpClient) {}

  async getAll(): Promise<ApiResponse<{ courses: Course[] }>> {
    return firstValueFrom(this.http.get<ApiResponse<{ courses: Course[] }>>(`${API_BASE}/courses`));
  }

  async getById(id: string): Promise<ApiResponse<{ course: Course }>> {
    return firstValueFrom(this.http.get<ApiResponse<{ course: Course }>>(`${API_BASE}/courses/${id}`));
  }

  async create(formData: FormData): Promise<ApiResponse<{ course: Course }>> {
    return firstValueFrom(this.http.post<ApiResponse<{ course: Course }>>(`${API_BASE}/courses`, formData));
  }

  async update(id: string, formData: FormData): Promise<ApiResponse<{ course: Course }>> {
    return firstValueFrom(this.http.patch<ApiResponse<{ course: Course }>>(`${API_BASE}/courses/${id}`, formData));
  }

  async remove(id: string): Promise<ApiResponse> {
    return firstValueFrom(this.http.delete<ApiResponse>(`${API_BASE}/courses/${id}`));
  }
}
