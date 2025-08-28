import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/api/http.service';
import type { Course } from '../../../core/models/course.model';
import { map } from 'rxjs';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private http: HttpService) {}

  searchTitles(query: string) {
    // Return empty array if no query to avoid showing all courses
    if (!query || query.trim() === '') {
      return of([]);
    }

    const qp = `?q=${encodeURIComponent(query)}&_limit=8`;
    return this.http.get<Course[]>(`/courses${qp}`).pipe(
      map((event: any) => (event && event.body ? event.body : event)), // extract body if HttpEvent
      map((list: Course[]) => list.map((c) => c.title))
    );
  }

  getNewlyLaunched() {
    return this.http
      .get<Course[]>(`/courses?_limit=12`)
      .pipe(map((event: any) => (event && event.body ? event.body : event)));
  }

  getLastViewed() {
    return this.http.get<Course[]>(`/courses?_limit=12`).pipe(
      map((event: any) => (event && event.body ? event.body : event)), // extract body if HttpEvent
      map((cs: Course[], i = 0) =>
        cs.map((c, idx) => ({ ...c, progressPercent: [21, 60, 80, 35, 0][idx % 5] }))
      )
    );
  }

  // add at bottom of class
  getCourse(id: string) {
    return this.http
      .get<Course>(`/courses/${id}`)
      .pipe(map((event: any) => (event && event.body ? event.body : event)));
  }

  getSections(courseId: string) {
    return this.http
      .get<any>(`/sections?courseId=${courseId}`)
      .pipe(
        map(
          (b: unknown) =>
            b as Array<{ id: string; courseId: string; title: string; summary: string }>
        )
      );
  }

  getLectures(courseId: string) {
    return this.http.get<any>(`/lectures?courseId=${courseId}`).pipe(
      map(
        (b: unknown) =>
          b as Array<{
            id: string;
            sectionId: string;
            title: string;
            type: 'video' | 'pdf' | 'text';
            durationMinutes: number;
          }>
      )
    );
  }

  getReviews(courseId: string) {
    return this.http.get<any>(`/reviews?courseId=${courseId}`).pipe(
      map(
        (b: unknown) =>
          b as Array<{
            id: string;
            rating: number;
            text: string;
            authorName: string;
            authorAvatar?: string;
            affiliation?: string;
          }>
      )
    );
  }
}
