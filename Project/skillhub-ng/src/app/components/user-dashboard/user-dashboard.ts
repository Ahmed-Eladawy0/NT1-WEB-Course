import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Header } from '../../shared/header/header';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { ToastService } from '../../core/services/toast.service';
import { Course } from '../../core/models/models';
import {
  capitalizeWords,
  categoryColors,
  categoryIconSvg,
  courseIdOf,
  levelFilledDots,
  uploadedFileUrl,
} from '../../core/utils';

@Component({
  selector: 'app-user-dashboard',
  imports: [FormsModule, Header],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  private auth = inject(AuthService);
  private courseService = inject(CourseService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  loading = true;
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  categories: string[] = [];
  enrolledIds = new Set<string>();
  enrollingIds = new Set<string>();

  searchTitle = '';
  filterCategory = '';
  maxPrice: number | null = null;

  get firstName(): string {
    return this.auth.user()?.firstName || 'there';
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.refreshProfile(), this.fetchCourses()]);
  }

  async refreshProfile(): Promise<void> {
    try {
      const user = await this.auth.refreshProfile();
      this.enrolledIds = new Set((user?.myCourses || []).map((c) => courseIdOf(c)!).filter(Boolean));
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }

  async fetchCourses(): Promise<void> {
    this.loading = true;
    try {
      const data = await this.courseService.getAll();
      this.allCourses = data.data?.courses || [];
      this.categories = [...new Set(this.allCourses.map((c) => c.category).filter(Boolean))].sort();
      this.applyFilters();
    } catch (err) {
      console.error('Error fetching courses:', err);
      this.toast.error('Could not load courses. Is the backend running?');
    } finally {
      this.loading = false;
    }
  }

  applyFilters(): void {
    const search = this.searchTitle.toLowerCase();
    this.filteredCourses = this.allCourses.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(search);
      const matchCategory = this.filterCategory === '' || c.category === this.filterCategory;
      const matchPrice = this.maxPrice === null || this.maxPrice === undefined || (this.maxPrice as any) === '' || c.price <= Number(this.maxPrice);
      return matchTitle && matchCategory && matchPrice;
    });
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.filterCategory = '';
    this.maxPrice = null;
    this.applyFilters();
  }

  isEnrolled(course: Course): boolean {
    return this.enrolledIds.has(course._id);
  }
  isEnrolling(course: Course): boolean {
    return this.enrollingIds.has(course._id);
  }

  async enroll(course: Course): Promise<void> {
    this.enrollingIds.add(course._id);
    try {
      const data = await this.auth.enroll(course._id);
      if (data.status === 'success') {
        this.enrolledIds.add(course._id);
        this.toast.success(`Enrolled in "${course.title}"`);
      } else {
        this.toast.error(data.message || 'Failed to enroll');
      }
    } catch (err: any) {
      console.error('Error enrolling course:', err);
      this.toast.error(err?.error?.message || 'Could not reach the server.');
    } finally {
      this.enrollingIds.delete(course._id);
    }
  }

  /* ---- display helpers ---- */
  capitalize = capitalizeWords;
  levelDots(level: string | undefined): boolean[] {
    const filled = levelFilledDots(level);
    return [0, 1, 2].map((i) => i < filled);
  }
  coverImage(course: Course): string | null {
    return uploadedFileUrl('courses', course.imageUrl);
  }
  coverColors(course: Course) {
    return categoryColors(course.category);
  }
  coverIconSvg(course: Course): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(categoryIconSvg(course.category));
  }
}
