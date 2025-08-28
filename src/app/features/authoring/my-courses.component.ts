import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../dashboard/header/header.component';
import { CourseCardComponent } from '../../shared/components/course-card/course-card.component';
import { AuthoringService } from './authoring.service';

@Component({
  standalone: true,
  selector: 'app-my-courses',
  imports: [CommonModule, RouterLink, HeaderComponent, CourseCardComponent],
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent {
  private service = inject(AuthoringService);

  q = signal('');
  tab = signal<'Published' | 'Draft' | 'Archived'>('Published');
  all = signal<any[]>([]);

  ngOnInit() {
    this.service.myCourses().subscribe((cs) => {
      if (Array.isArray(cs)) {
        this.all.set(cs);
      } else {
        // Handle HttpResponse case
        this.all.set((cs as any).body || []);
      }
    });
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.q.set(input.value);
  }

  list = computed(() => {
    const filtered = this.service.filterByStatus(this.all(), this.tab());
    return this.service.search(filtered, this.q());
  });
}
