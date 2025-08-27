import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../dashboard/header/header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { ProfileService } from './profile.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, HeaderComponent, StatCardComponent, CourseCardComponent, DatePipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private ps = inject(ProfileService);

  user = this.ps.user;
  enrolled = this.ps.enrolledCourses;
  stats = this.ps.stats;

  ngOnInit() {
    this.ps.load();
  }
}
