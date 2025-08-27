import { Component, Input } from '@angular/core';
import type { Course } from '../../../core/models/course.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-course-card',
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;
}
