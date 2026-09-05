import { Component, input, output, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Course } from '../../../core/models/models';
import {
  capitalizeWords,
  categoryColors,
  categoryIconSvg,
  levelFilledDots,
  uploadedFileUrl,
} from '../../../core/utils';

@Component({
  selector: '[app-course-row]', 
  standalone: true,
  templateUrl: './course-row.html'
})
export class CourseRowComponent {
  course = input.required<Course>();

  onEdit = output<Course>();
  onDelete = output<Course>();

  private sanitizer = inject(DomSanitizer);
  capitalize = capitalizeWords;

  get coverUrl(): string | null {
    return uploadedFileUrl('courses', this.course().imageUrl);
  }
  get coverColors() {
    return categoryColors(this.course().category);
  }
  get coverIcon(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(categoryIconSvg(this.course().category));
  }
  get dots(): boolean[] {
    const filled = levelFilledDots(this.course().level);
    return [0, 1, 2].map((i) => i < filled);
  }

  edit() {
    this.onEdit.emit(this.course());
  }

  delete() {
    this.onDelete.emit(this.course());
  }
}