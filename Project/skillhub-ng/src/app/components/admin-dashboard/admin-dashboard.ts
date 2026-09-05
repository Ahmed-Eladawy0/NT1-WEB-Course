import { Component, inject, OnInit, signal, computed } from '@angular/core'; // 👈 استدعينا signal و computed
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Header } from '../../shared/header/header';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { Course, User } from '../../core/models/models';
import {
  capitalizeWords,
  categoryColors,
  categoryIconSvg,
  fullName,
  levelFilledDots,
  uploadedFileUrl,
} from '../../core/utils';
import { CourseRowComponent } from './course-row/course-row';
import { UserRowComponent } from './user-row/user-row';

type Tab = 'courses' | 'users';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, Header, CourseRowComponent, UserRowComponent],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private auth = inject(AuthService);
  private courseService = inject(CourseService);
  private toast = inject(ToastService);
  private confirmService = inject(ConfirmService);
  private sanitizer = inject(DomSanitizer);

  activeTab: Tab = 'courses';

  coursesCache = signal<Course[]>([]);
  usersCache = signal<User[]>([]);
  
  searchQuery = signal<string>('');

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.coursesCache().filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.instructor.toLowerCase().includes(q)
    );
  });

  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.usersCache().filter(u => 
      fullName(u).toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    );
  });

  statCourses = computed(() => this.coursesCache().length);
  statUsers = computed(() => this.usersCache().length);
  statAdmins = computed(() => this.usersCache().filter((u) => u.role === 'admin').length);
  statEnrollments = computed(() => 
    this.usersCache().reduce((sum, u) => sum + (u.myCourses ? u.myCourses.length : 0), 0)
  );

  isEditing = false;
  savingCourse = false;
  courseId = '';
  coverFile: File | null = null;
  coverPreviewUrl: string | null = null;

  courseForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    instructor: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    level: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required])
  });

  togglingRoleId: string | null = null;
  deletingUserId: string | null = null;
  capitalize = capitalizeWords;
  fullName = fullName;

  get currentUserId(): string | undefined {
    return this.auth.user()?._id;
  }

  switchTab(tab: Tab): void {
    this.activeTab = tab;
    this.searchQuery.set(''); 
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.fetchCourses(), this.fetchUsers()]);
  }

  /* ---------------- Courses ---------------- */
  async fetchCourses(): Promise<void> {
    try {
      const data = await this.courseService.getAll();
      this.coursesCache.set(data.data?.courses || []); 
    } catch (err) {
      console.error('Error fetching courses:', err);
      this.toast.error('Could not load courses.');
    }
  }

  rowCoverUrl(c: Course): string | null { return uploadedFileUrl('courses', c.imageUrl); }
  rowCoverColors(c: Course) { return categoryColors(c.category); }
  rowCoverIcon(c: Course): SafeHtml { return this.sanitizer.bypassSecurityTrustHtml(categoryIconSvg(c.category)); }
  levelDots(level: string | undefined): boolean[] {
    const filled = levelFilledDots(level);
    return [0, 1, 2].map((i) => i < filled);
  }

  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toast.error('Please choose an image file.');
      return;
    }
    this.coverFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => { this.coverPreviewUrl = ev.target?.result as string; };
    reader.readAsDataURL(file);
  }

  async onSubmitCourse(): Promise<void> {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    this.savingCourse = true;
    const formValues = this.courseForm.value;
    const fd = new FormData();
    fd.append('title', formValues.title || '');
    fd.append('instructor', formValues.instructor || '');
    fd.append('category', formValues.category || '');
    fd.append('price', String(formValues.price ?? ''));
    fd.append('level', formValues.level || '');
    fd.append('duration', formValues.duration || '');
    if (this.coverFile) fd.append('imageUrl', this.coverFile);

    try {
      const data = this.isEditing
        ? await this.courseService.update(this.courseId, fd)
        : await this.courseService.create(fd);

      if (data.status === 'success') {
        this.toast.success(this.isEditing ? 'Course updated' : 'Course added');
        this.resetCourseForm();
        await this.fetchCourses();
      } else {
        this.toast.error(data.message || 'Failed to save course');
      }
    } catch (err: any) {
      console.error('Error saving course:', err);
      this.toast.error(err?.error?.message || 'Could not reach the server.');
    } finally {
      this.savingCourse = false;
    }
  }

  editCourse(c: Course): void {
    this.isEditing = true;
    this.coverFile = null;
    this.courseId = c._id;
    this.coverPreviewUrl = uploadedFileUrl('courses', c.imageUrl);
    this.courseForm.patchValue({
      title: c.title,
      instructor: c.instructor,
      category: c.category, 
      price: c.price,
      level: c.level,
      duration: c.duration || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetCourseForm(): void {
    this.isEditing = false;
    this.coverFile = null;
    this.coverPreviewUrl = null;
    this.courseId = '';
    this.courseForm.reset();
  }

  async deleteCourse(c: Course): Promise<void> {
    const ok = await this.confirmService.ask({
      title: 'Delete this course?',
      message: `"${c.title}" will be permanently removed.`,
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    try {
      const data = await this.courseService.remove(c._id);
      if (data.status === 'success') {
        this.toast.success('Course deleted');
        await this.fetchCourses();
      } else {
        this.toast.error(data.message || 'Failed to delete');
      }
    } catch (err: any) {
      this.toast.error(err?.error?.message || 'Error deleting.');
    }
  }

  /* ---------------- Users ---------------- */
  async fetchUsers(): Promise<void> {
    try {
      const data = await this.auth.getAllUsers();
      this.usersCache.set(data.data?.users || []); 
    } catch (err) {
      this.toast.error('Could not load users.');
    }
  }

  userAvatarUrl(u: User): string | null { return uploadedFileUrl('users', u.imageUrl); }
  userEnrolledCount(u: User): number { return u.myCourses ? u.myCourses.length : 0; }
  isSelf(u: User): boolean { return u._id === this.currentUserId; }

  async toggleRole(u: User): Promise<void> {
    this.togglingRoleId = u._id;
    try {
      const data = await this.auth.toggleUserRole(u._id);
      if (data.status === 'success') {
        this.toast.success('Role updated');
        await this.fetchUsers();
      } else {
        this.toast.error(data.message || 'Could not update role.');
      }
    } catch (err: any) {
      this.toast.error(err?.error?.message || 'Could not update role.');
    } finally {
      this.togglingRoleId = null;
    }
  }

  async deleteUser(u: User): Promise<void> {
    const ok = await this.confirmService.ask({
      title: 'Delete this user?',
      message: `${fullName(u)}'s account will be removed.`,
      confirmLabel: 'Delete user',
    });
    if (!ok) return;
    this.deletingUserId = u._id;
    try {
      const data = await this.auth.deleteUser(u._id);
      if (data.status === 'success') {
        this.toast.success('User deleted');
        await this.fetchUsers();
      } else {
        this.toast.error(data.message || 'Failed to delete');
      }
    } catch (err: any) {
      this.toast.error(err?.error?.message || 'Error deleting.');
    } finally {
      this.deletingUserId = null;
    }
  }
}