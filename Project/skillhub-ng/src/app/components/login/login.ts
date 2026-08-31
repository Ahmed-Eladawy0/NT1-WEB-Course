import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  themeService = inject(ThemeService);

  isLogin = true;
  isLoading = false;
  avatarFile: File | null = null;
  avatarPreviewUrl: string | null = null;

  // form fields
  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  password = '';

  setMode(login: boolean): void {
    this.isLogin = login;
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
      this.avatarPreviewUrl = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    try {
      let data;
      if (this.isLogin) {
        data = await this.auth.login(this.email.trim(), this.password);
      } else {
        const fd = new FormData();
        fd.append('firstName', this.firstName.trim());
        fd.append('lastName', this.lastName.trim());
        fd.append('email', this.email.trim());
        fd.append('password', this.password);
        if (this.phone.trim()) fd.append('phone', this.phone.trim());
        if (this.avatarFile) fd.append('imageUrl', this.avatarFile);
        data = await this.auth.signup(fd);
      }

      if (data.status === 'success' && data.data) {
        this.toast.success(this.isLogin ? 'Welcome back!' : 'Account created — welcome!', 1200);
        setTimeout(() => {
          this.router.navigateByUrl(data.data!.user.role === 'admin' ? '/admin' : '/dashboard');
        }, 300);
      } else {
        this.toast.error(data.message || 'Something went wrong');
      }
    } catch (err: any) {
      console.error(err);
      const message = err?.error?.message || 'Could not reach the server. Is the backend running?';
      this.toast.error(message);
    } finally {
      this.isLoading = false;
    }
  }
}
