import { Component, input, output, inject } from '@angular/core';
import { User, Course, PaymentRecord } from '../../../core/models/models';
import { fullName, uploadedFileUrl } from '../../../core/utils';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: '[app-user-row]',
  standalone: true,
  templateUrl: './user-row.html'
})
export class UserRowComponent {
  user = input.required<User>();
  togglingId = input<string | null>(null);
  deletingId = input<string | null>(null);

  onToggleRole = output<User>();
  onDelete = output<User>();

  private auth = inject(AuthService);
  fullName = fullName;

  get avatarUrl(): string | null {
    return uploadedFileUrl('users', this.user().imageUrl);
  }
  get enrolledCount(): number {
    return this.user().myCourses?.length ?? 0;
  }
  
  get enrolledCourses(): Course[] {
    const courses = this.user().myCourses;
    if (!courses) return [];
    // Only return fully populated Course objects that are not null/undefined
    return courses.filter(c => c && typeof c !== 'string') as Course[];
  }
  
  get enrolledData(): { course: Course, payment?: PaymentRecord }[] {
    const courses = this.enrolledCourses;
    const payments = this.user().payments || [];
    
    return courses.map(course => {
      const payment = payments.find(p => 
        (typeof p.courseId === 'string' ? p.courseId : (p.courseId as Course)._id) === course._id
      );
      return { course, payment };
    });
  }
  get isSelf(): boolean {
    return this.user()._id === this.auth.user()?._id;
  }

  toggleRole() { this.onToggleRole.emit(this.user()); }
  deleteUser() { this.onDelete.emit(this.user()); }
}