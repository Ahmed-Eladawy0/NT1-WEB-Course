import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

type Tab = 'courses' | 'users';

@Component({
  selector: 'app-admin-dashboard',
  imports: [FormsModule, Header],
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

  coursesCache: Course[] = [];
  usersCache: User[] = [];

  isEditing = false;
  savingCourse = false;
  coverFile: File | null = null;
  coverPreviewUrl: string | null = null;

  // course form fields
  courseId = '';
  title = '';
  instructor = '';
  category = '';
  price: number | null = null;
  level = '';
  duration = '';

  togglingRoleId: string | null = null;
  deletingUserId: string | null = null;

  capitalize = capitalizeWords;
  fullName = fullName;

  get currentUserId(): string | undefined {
    return this.auth.user()?._id;
  }

  get statCourses(): number { return this.coursesCache.length; }
  get statUsers(): number { return this.usersCache.length; }
  get statAdmins(): number { return this.usersCache.filter((u) => u.role === 'admin').length; }
  get statEnrollments(): number {
    return this.usersCache.reduce((sum, u) => sum + (u.myCourses ? u.myCourses.length : 0), 0);
  }

  switchTab(tab: Tab): void {
    this.activeTab = tab;
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.fetchCourses(), this.fetchUsers()]);
  }

  /* ---------------- Courses ---------------- */
  async fetchCourses(): Promise<void> {
    try {
      const data = await this.courseService.getAll();
      this.coursesCache = data.data?.courses || [];
    } catch (err) {
      console.error('Error fetching courses:', err);
      this.toast.error('Could not load courses.');
    }
  }

  rowCoverUrl(c: Course): string | null {
    return uploadedFileUrl('courses', c.imageUrl);
  }
  rowCoverColors(c: Course) {
    return categoryColors(c.category);
  }
  rowCoverIcon(c: Course): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(categoryIconSvg(c.category));
  }
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
    reader.onload = (ev) => {
      this.coverPreviewUrl = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onSubmitCourse(): Promise<void> {
    this.savingCourse = true;
    const fd = new FormData();
    fd.append('title', this.title);
    fd.append('instructor', this.instructor);
    fd.append('category', this.category);
    fd.append('price', String(this.price ?? ''));
    fd.append('level', this.level);
    fd.append('duration', this.duration);
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
    this.title = c.title;
    this.instructor = c.instructor;
    this.category = capitalizeWords(c.category);
    this.price = c.price;
    this.level = capitalizeWords(c.level);
    this.duration = c.duration || '';
    this.coverPreviewUrl = uploadedFileUrl('courses', c.imageUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetCourseForm(): void {
    this.isEditing = false;
    this.coverFile = null;
    this.coverPreviewUrl = null;
    this.courseId = '';
    this.title = '';
    this.instructor = '';
    this.category = '';
    this.price = null;
    this.level = '';
    this.duration = '';
  }

  async deleteCourse(c: Course): Promise<void> {
    const ok = await this.confirmService.ask({
      title: 'Delete this course?',
      message: `"${c.title}" will be permanently removed from the catalog.`,
      confirmLabel: 'Delete course',
    });
    if (!ok) return;
    try {
      const data = await this.courseService.remove(c._id);
      if (data.status === 'success') {
        this.toast.success('Course deleted');
        await this.fetchCourses();
      } else {
        this.toast.error(data.message || 'Failed to delete course');
      }
    } catch (err: any) {
      console.error('Error deleting course:', err);
      this.toast.error(err?.error?.message || 'Could not delete the course.');
    }
  }

  /* ---------------- Users ---------------- */
  async fetchUsers(): Promise<void> {
    try {
      const data = await this.auth.getAllUsers();
      this.usersCache = data.data?.users || [];
    } catch (err) {
      console.error('Error fetching users:', err);
      this.toast.error('Could not load users.');
    }
  }

  userAvatarUrl(u: User): string | null {
    return uploadedFileUrl('users', u.imageUrl);
  }
  userEnrolledCount(u: User): number {
    return u.myCourses ? u.myCourses.length : 0;
  }
  isSelf(u: User): boolean {
    return u._id === this.currentUserId;
  }

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
      console.error('Error toggling role:', err);
      this.toast.error(err?.error?.message || 'Could not update role.');
    } finally {
      this.togglingRoleId = null;
    }
  }

  async deleteUser(u: User): Promise<void> {
    const ok = await this.confirmService.ask({
      title: 'Delete this user?',
      message: `${fullName(u)}'s account will be permanently removed.`,
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
        this.toast.error(data.message || 'Failed to delete user');
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      this.toast.error(err?.error?.message || 'Could not reach the server.');
    } finally {
      this.deletingUserId = null;
    }
  }
}
