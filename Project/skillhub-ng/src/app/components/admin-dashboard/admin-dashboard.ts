import { Component, inject, OnInit, signal, computed } from '@angular/core'; 
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
    title:       new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    instructor:  new FormControl('', [Validators.required]),
    category:    new FormControl('', [Validators.required]),
    price:       new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    level:       new FormControl('', [Validators.required]),
    duration:    new FormControl('', [Validators.required]),
    description: new FormControl(''),
    videoUrl:    new FormControl('')
  });

  togglingRoleId: string | null = null;
  deletingUserId: string | null = null;
  capitalize = capitalizeWords;
  fullName = fullName;

  /* ---- rich-content tag state ---- */
  whatYouWillLearnItems: string[] = [];
  requirementsItems:     string[] = [];
  toolsItems:            string[] = [];

  addTagItem(input: HTMLInputElement, target: 'learn' | 'req' | 'tools'): void {
    const val = input.value.trim();
    if (!val) return;
    if (target === 'learn' && !this.whatYouWillLearnItems.includes(val))
      this.whatYouWillLearnItems = [...this.whatYouWillLearnItems, val];
    else if (target === 'req' && !this.requirementsItems.includes(val))
      this.requirementsItems = [...this.requirementsItems, val];
    else if (target === 'tools' && !this.toolsItems.includes(val))
      this.toolsItems = [...this.toolsItems, val];
    input.value = '';
  }

  removeTagItem(index: number, target: 'learn' | 'req' | 'tools'): void {
    if (target === 'learn')  this.whatYouWillLearnItems = this.whatYouWillLearnItems.filter((_, i) => i !== index);
    else if (target === 'req')   this.requirementsItems = this.requirementsItems.filter((_, i) => i !== index);
    else if (target === 'tools') this.toolsItems        = this.toolsItems.filter((_, i) => i !== index);
  }

  get currentUserId(): string | undefined {
    return this.auth.user()?._id;
  }

  switchTab(tab: Tab): void {
    this.activeTab = tab;
    this.searchQuery.set(''); 
  }

  ngOnInit(): void {
    this.fetchCourses();
    this.fetchUsers();
  }

  /* ---------------- Courses ---------------- */
  fetchCourses(): void {
    this.courseService.getAll().subscribe({
      next: (data) => {
        this.coursesCache.set(data.data?.courses || []); 
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.toast.error('Could not load courses.');
      }
    });
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

  onSubmitCourse(): void {
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
    // Optional rich-detail fields
    fd.append('description', formValues.description || '');
    fd.append('videoUrl',    formValues.videoUrl    || '');
    if (this.whatYouWillLearnItems.length) fd.append('whatYouWillLearn', JSON.stringify(this.whatYouWillLearnItems));
    if (this.requirementsItems.length)     fd.append('requirements',     JSON.stringify(this.requirementsItems));
    if (this.toolsItems.length)            fd.append('tools',            JSON.stringify(this.toolsItems));

    const request$ = this.isEditing 
      ? this.courseService.update(this.courseId, fd)
      : this.courseService.create(fd);

    request$.subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.toast.success(this.isEditing ? 'Course updated' : 'Course added');
          this.resetCourseForm();
          this.fetchCourses();
        } else {
          this.toast.error(data.message || 'Failed to save course');
        }
        this.savingCourse = false;
      },
      error: (err) => {
        console.error('Error saving course:', err);
        this.toast.error(err.message || 'Could not reach the server.');
        this.savingCourse = false;
      }
    });
  }

  editCourse(c: Course): void {
    this.isEditing = true;
    this.coverFile = null;
    this.courseId = c._id;
    this.coverPreviewUrl = uploadedFileUrl('courses', c.imageUrl);
    // Populate tag arrays from existing course data
    this.whatYouWillLearnItems = Array.isArray(c.whatYouWillLearn) ? [...c.whatYouWillLearn] : [];
    this.requirementsItems     = Array.isArray(c.requirements)     ? [...c.requirements]     : [];
    this.toolsItems            = Array.isArray(c.tools)            ? [...c.tools]            : [];
    this.courseForm.patchValue({
      title:       c.title,
      instructor:  c.instructor,
      category:    c.category,
      price:       c.price,
      level:       c.level,
      duration:    c.duration    || '',
      description: c.description || '',
      videoUrl:    c.videoUrl    || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetCourseForm(): void {
    this.isEditing = false;
    this.coverFile = null;
    this.coverPreviewUrl = null;
    this.courseId = '';
    this.whatYouWillLearnItems = [];
    this.requirementsItems     = [];
    this.toolsItems            = [];
    this.courseForm.reset();
  }

  async deleteCourse(c: Course): Promise<void> {
    const ok = await this.confirmService.ask({
      title: 'Delete this course?',
      message: `"${c.title}" will be permanently removed.`,
      confirmLabel: 'Delete',
    });
    if (!ok) return;

    this.courseService.remove(c._id).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.toast.success('Course deleted');
          this.coursesCache.update((courses) => courses.filter((course) => course._id !== c._id)); 
        } 
        else {
          this.toast.error(data.message || 'Failed to delete');
        }
      },
      error: (err) => {
        this.toast.error(err.message || 'Error deleting.');
      }
    });
  }

  /* ---------------- Users ---------------- */
  fetchUsers(): void {
    this.auth.getAllUsers().subscribe({
      next: (data) => {
        this.usersCache.set(data.data?.users || []); 
      },
      error: (err) => {
        this.toast.error('Could not load users.');
      }
    });
  }

  userAvatarUrl(u: User): string | null { return uploadedFileUrl('users', u.imageUrl); }
  userEnrolledCount(u: User): number { return u.myCourses ? u.myCourses.length : 0; }
  isSelf(u: User): boolean { return u._id === this.currentUserId; }

  toggleRole(u: User): void {
    this.togglingRoleId = u._id;
    this.auth.toggleUserRole(u._id).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.toast.success('Role updated');
          this.fetchUsers();
        } else {
          this.toast.error(data.message || 'Could not update role.');
        }
        this.togglingRoleId = null;
      },
      error: (err) => {
        this.toast.error(err.message || 'Could not update role.');
        this.togglingRoleId = null;
      }
    });
  }

  async deleteUser(u: User): Promise<void> {
    const ok = await this.confirmService.ask({
      title: 'Delete this user?',
      message: `${fullName(u)}'s account will be removed.`,
      confirmLabel: 'Delete user',
    });
    if (!ok) return;
    
    this.deletingUserId = u._id;
    this.auth.deleteUser(u._id).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.toast.success('User deleted');
          this.fetchUsers();
        } else {
          this.toast.error(data.message || 'Failed to delete');
        }
        this.deletingUserId = null;
      },
      error: (err) => {
        this.toast.error(err.message || 'Error deleting.');
        this.deletingUserId = null;
      }
    });
  }
}