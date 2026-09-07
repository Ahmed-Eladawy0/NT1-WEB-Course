import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
  standalone: true,
  imports: [FormsModule, Header],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  private auth = inject(AuthService);
  private courseService = inject(CourseService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  loading = signal(true);
  allCourses = signal<Course[]>([]);
  categories = signal<string[]>([]);
  
  enrolledIds = signal<Set<string>>(new Set());
  enrollingIds = signal<Set<string>>(new Set());

  searchTitle = signal('');
  filterCategory = signal('');
  maxPrice = signal<number | null>(null);

  filteredCourses = computed(() => {
    const search = this.searchTitle().toLowerCase();
    const cat = this.filterCategory();
    const price = this.maxPrice();

    return this.allCourses().filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(search);
      const matchCategory = cat === '' || c.category === cat;
      const matchPrice = price === null || price === undefined || (price as any) === '' || c.price <= Number(price);
      return matchTitle && matchCategory && matchPrice;
    });
  });

  get firstName(): string {
    return this.auth.user()?.firstName || 'there';
  }

  ngOnInit(): void {
    this.refreshProfile();
    this.fetchCourses();
  }

  refreshProfile(): void {
    this.auth.refreshProfile().subscribe({
      next: (user) => {
        const ids = new Set((user?.myCourses || []).map((c) => courseIdOf(c)!).filter(Boolean));
        this.enrolledIds.set(ids);
      },
      error: (err) => {
        console.error('Error refreshing profile:', err);
      }
    });
  }

  fetchCourses(): void {
    this.loading.set(true);
    this.courseService.getAll().subscribe({
      next: (data) => {
        const courses = data.data?.courses || [];
        this.allCourses.set(courses);
        
        const cats = [...new Set(courses.map((c: Course) => c.category).filter(Boolean))].sort() as string[];
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.toast.error('Could not load courses. Is the backend running?');
        this.loading.set(false);
      }
    });
  }

  clearFilters(): void {
    this.searchTitle.set('');
    this.filterCategory.set('');
    this.maxPrice.set(null);
  }

  isEnrolled(course: Course): boolean {
    return this.enrolledIds().has(course._id);
  }
  
  isEnrolling(course: Course): boolean {
    return this.enrollingIds().has(course._id);
  }

  enroll(course: Course): void {
    const currentEnrolling = new Set(this.enrollingIds());
    currentEnrolling.add(course._id);
    this.enrollingIds.set(currentEnrolling);

    this.auth.enroll(course._id).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          const currentEnrolled = new Set(this.enrolledIds());
          currentEnrolled.add(course._id);
          this.enrolledIds.set(currentEnrolled);
          
          this.toast.success(`Enrolled in "${course.title}"`);
        } else {
          this.toast.error(data.message || 'Failed to enroll');
        }
        this.removeEnrolling(course._id);
      },
      error: (err) => {
        console.error('Error enrolling course:', err);
        this.toast.error(err.message || 'Could not reach the server.');
        this.removeEnrolling(course._id);
      }
    });
  }

  private removeEnrolling(courseId: string): void {
    const updatedEnrolling = new Set(this.enrollingIds());
    updatedEnrolling.delete(courseId);
    this.enrollingIds.set(updatedEnrolling);
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