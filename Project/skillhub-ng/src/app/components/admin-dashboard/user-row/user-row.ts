import { Component, input, output, inject } from '@angular/core';
import { User } from '../../../core/models/models';
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
  get isSelf(): boolean {
    return this.user()._id === this.auth.user()?._id;
  }

  toggleRole() { this.onToggleRole.emit(this.user()); }
  deleteUser() { this.onDelete.emit(this.user()); }
}