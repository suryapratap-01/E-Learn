import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../dashboard/header/header.component';
import { AuthoringService } from './authoring.service';

@Component({
  standalone: true,
  selector: 'app-create-course',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent],
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss'],
})
export class CreateCourseComponent {
  private fb = inject(FormBuilder);
  private service = inject(AuthoringService);
  private router = inject(Router);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    provider: [''],
    thumbnailUrl: [''],
    level: ['Beginner', Validators.required],
    durationMinutes: [60, [Validators.required, Validators.min(1)]],
    rating: [0],
    reviews: [0],
    enrollments: [0],
    skills: this.fb.array<string>([]),
    whatYouWillLearn: this.fb.array<string>([]),
    requirements: this.fb.array<string>([]),
    description: [''],
    badges: this.fb.array<string>([]),
    status: ['Draft', Validators.required],
  });

  get skills() {
    return this.form.get('skills') as FormArray;
  }
  get learn() {
    return this.form.get('whatYouWillLearn') as FormArray;
  }
  get reqs() {
    return this.form.get('requirements') as FormArray;
  }
  get badges() {
    return this.form.get('badges') as FormArray;
  }

  addArr(ctrl: FormArray, value: string) {
    ctrl.push(this.fb.control(value));
  }
  removeArr(ctrl: FormArray, i: number) {
    ctrl.removeAt(i);
  }

  addBadge(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.addArr(this.badges, value);
      input.value = '';
    }
    event.preventDefault();
  }

  addSkill(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.addArr(this.skills, value);
      input.value = '';
    }
    event.preventDefault();
  }

  addLearnPoint(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.addArr(this.learn, value);
      input.value = '';
    }
    event.preventDefault();
  }

  addRequirement(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value) {
      this.addArr(this.reqs, value);
      input.value = '';
    }
    event.preventDefault();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.service.createCourse(this.form.value as any).subscribe(() => {
      this.router.navigateByUrl('/author');
    });
  }
}
