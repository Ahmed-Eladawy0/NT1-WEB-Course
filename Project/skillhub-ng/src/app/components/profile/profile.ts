import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { NgStyle } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Header } from '../../shared/header/header';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Course, User } from '../../core/models/models';
import { capitalizeWords, categoryIconSvg, fullName, initials, uploadedFileUrl } from '../../core/utils';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, Header],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  loadingCourses = signal(true);
  saving = signal(false);
  myCourses = signal<Course[]>([]);
  email = signal(''); 
  
  avatarFile: File | null = null;
  avatarPreviewUrl = signal<string | null>(null);

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl('', [Validators.pattern('^[0-9+]*$')])
  });

  capitalize = capitalizeWords;

  ngOnInit(): void {
    const cached = this.auth.user();
    if (cached) {
      this.populateForm(cached, cached.myCourses as Course[] | undefined);
    }

    // 🔥 شلنا الـ async/await واستخدمنا subscribe
    this.auth.refreshProfile().subscribe({
      next: (user) => {
        if (user) {
          this.populateForm(user, user.myCourses as Course[] | undefined);
        }
        this.loadingCourses.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.loadingCourses.set(false);
      }
    });
  }

  private populateForm(user: User, myCourses: Course[] | undefined): void {
    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    });
    
    this.email.set(user.email || '');
    this.myCourses.set((myCourses || []).filter((c): c is Course => typeof c === 'object'));
  }

  get avatarUrl(): string | null {
    return this.avatarPreviewUrl() || uploadedFileUrl('users', this.auth.user()?.imageUrl);
  }
  get avatarInitials(): string {
    return initials(fullName(this.auth.user()));
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toast.error('Please choose an image file.');
      return;
    }
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.avatarPreviewUrl.set(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  courseCoverStyle(course: Course): { [key: string]: string } {
    const url = uploadedFileUrl('courses', course.imageUrl);
    return url ? { 'background-image': `url('${url}')` } : { background: 'var(--brand-soft)', color: 'var(--brand)' };
  }
  
  courseCoverIcon(course: Course): SafeHtml | null {
    if (uploadedFileUrl('courses', course.imageUrl)) return null;
    return this.sanitizer.bypassSecurityTrustHtml(categoryIconSvg(course.category));
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValues = this.profileForm.value;
    const fd = new FormData();
    
    fd.append('firstName', formValues.firstName?.trim() || '');
    fd.append('lastName', formValues.lastName?.trim() || '');
    if (formValues.phone?.trim()) fd.append('phone', formValues.phone.trim());
    if (this.avatarFile) fd.append('imageUrl', this.avatarFile);

    this.auth.updateProfile(fd).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.avatarFile = null;
          this.avatarPreviewUrl.set(null);
          this.toast.success('Profile updated successfully!');
        } else {
          this.toast.error(data.message || 'Failed to update profile');
        }
        this.saving.set(false);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.toast.error(err.message || 'Could not reach the server.');
        this.saving.set(false);
      }
    });
  }
}