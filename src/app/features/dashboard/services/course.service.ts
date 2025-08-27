import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/api/http.service';
import type { Course } from '../../../core/models/course.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpService) {}

  searchTitles(query: string) {
    const qp = query ? `?q=${encodeURIComponent(query)}&_limit=8` : '?_limit=8';
    return this.http.get<Course[]>(`/courses${qp}`).pipe(
      map((event: any) => (event && event.body ? event.body : event)), // extract body if HttpEvent
      map((list: Course[]) => list.map((c) => c.title))
    );
  }

  getNewlyLaunched() {
    return this.http.get<Course[]>(`/courses?_sort=id&_order=desc&_limit=16`);
  }

  getLastViewed() {
    return this.http.get<Course[]>(`/courses?_limit=12`).pipe(
      map((event: any) => (event && event.body ? event.body : event)), // extract body if HttpEvent
      map((cs: Course[], i = 0) =>
        cs.map((c, idx) => ({ ...c, progressPercent: [21, 60, 80, 35, 0][idx % 5] }))
      )
    );
  }
}
