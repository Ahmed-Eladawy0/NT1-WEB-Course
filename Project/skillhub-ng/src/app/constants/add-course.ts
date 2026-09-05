import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../constants/course-constants';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, TitleCasePipe], 
  templateUrl: './add-course.html', 
  styleUrl: './add-course.css'
})
export class AddCourseComponent {
  categories = COURSE_CATEGORIES;
  levels = COURSE_LEVELS;

  addCourseForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    instructor: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    level: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    duration: new FormControl('', [Validators.required]),
    rating: new FormControl(0, [Validators.min(0), Validators.max(5)]),
    students: new FormControl(0, [Validators.min(0)]),
    imageUrl: new FormControl(''),
    description: new FormControl('', [Validators.maxLength(1000)])
  });

  onSubmit() {
    if (this.addCourseForm.invalid) {
      this.addCourseForm.markAllAsTouched();
      return;
    }

    console.log('New Course Data:', this.addCourseForm.value);
    alert('Course added successfully (Check Console)! 🚀');
    this.addCourseForm.reset();
  }
}