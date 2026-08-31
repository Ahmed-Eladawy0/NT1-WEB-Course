import { Component, ElementRef, HostListener, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { fullName, initials, uploadedFileUrl } from '../../core/utils';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() roleLabel: 'learner' | 'admin' = 'learner';
  @Input() brandLink = '/dashboard';
  @Input() showProfileLink = true;

  auth = inject(AuthService);
  themeService = inject(ThemeService);
  private elementRef = inject(ElementRef);

  menuOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  closeMenu(): void {
    this.menuOpen = false;
  }

  get avatarUrl(): string | null {
    return uploadedFileUrl('users', this.auth.user()?.imageUrl);
  }
  get initials(): string {
    return initials(fullName(this.auth.user()));
  }
  get firstName(): string {
    return this.auth.user()?.firstName || 'Account';
  }

  logout(): void {
    this.auth.logout();
  }
}
