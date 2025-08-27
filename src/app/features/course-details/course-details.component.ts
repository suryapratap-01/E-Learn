import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../dashboard/services/course.service';
import type { Course } from '../../core/models/course.model';
import { MetricsBarComponent } from './metrics-bar/metrics-bar.component';
import { HeaderComponent } from '../dashboard/header/header.component';

type Section = { id: string; courseId: string; title: string; summary: string };
type Lecture = {
  id: string;
  sectionId: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  durationMinutes: number;
};

@Component({
  standalone: true,
  selector: 'app-course-details',
  imports: [CommonModule, RouterLink, MetricsBarComponent, HeaderComponent],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent {
  private route = inject(ActivatedRoute);
  private courseSvc = inject(CourseService);

  course = signal<Course | null>(null);
  sections = signal<Section[]>([]);
  lectures = signal<Lecture[]>([]);
  reviews = signal<any[]>([]);
  tab = signal<'overview' | 'content' | 'author' | 'testimonials'>('overview');

  expanded = signal<Set<string>>(new Set()); // accordion state

  ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.courseSvc.getCourse(id).subscribe((c) => this.course.set(c));
    this.courseSvc.getSections(id).subscribe((s) => this.sections.set(s));
    this.courseSvc.getLectures(id).subscribe((l) => this.lectures.set(l));
    this.courseSvc.getReviews(id).subscribe((r) => this.reviews.set(r));
  }

  toggle(sectionId: string) {
    const s = new Set(this.expanded());
    s.has(sectionId) ? s.delete(sectionId) : s.add(sectionId);
    this.expanded.set(s);
  }
  expandAll() {
    this.expanded.set(new Set(this.sections().map((s) => s.id)));
  }

  // helpers
  reviewsCount = computed(() => this.reviews().length);
  durationText = computed(() => {
    const mins = this.course()?.durationMinutes ?? 0;
    if (mins >= 60)
      return `${Math.round(mins / 60)
        .toString()
        .padStart(2, '0')}h`;
    return `${mins}m`;
  });
  lecturesBy = (sectionId: string) => this.lectures().filter((l) => l.sectionId === sectionId);
}
