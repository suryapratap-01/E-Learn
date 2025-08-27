import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { CourseService } from '../services/course.service';
import { DashboardService } from '../services/dashboard.service';
import type { Course } from '../../../core/models/course.model';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, HeaderComponent, CourseCardComponent, StatCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private course = inject(CourseService);
  private dash = inject(DashboardService);

  lastViewed = signal<Course[]>([]);
  newlyLaunched = signal<Course[]>([]);
  stats = this.dash.stats;

  ngOnInit() {
    this.course.getLastViewed().subscribe((cs) => this.lastViewed.set(cs));
    this.course.getNewlyLaunched().subscribe((event) => {
      if (event.type === 4 && 'body' in event && event.body) {
        this.newlyLaunched.set(event.body);
      }
    });
    this.dash.loadStats();
  }
}
