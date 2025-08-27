import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { Course } from '../../../core/models/course.model';

@Component({
  standalone: true,
  selector: 'app-course-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
}
