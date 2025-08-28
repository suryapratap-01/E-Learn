import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../core/api/http.service';
import { SessionStore } from '../../core/state/session.store';
import { map } from 'rxjs';

export type NewCoursePayload = {
  title: string;
  provider?: string;
  thumbnailUrl?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  rating?: number; // default 0
  reviews?: number; // default 0
  enrollments?: number; // default 0
  skills?: string[];
  whatYouWillLearn?: string[];
  requirements?: string[];
  description?: string;
  badges?: string[];
  status: 'Draft' | 'Published' | 'Archived';
};

@Injectable({ providedIn: 'root' })
export class AuthoringService {
  private http = inject(HttpService);
  private session = inject(SessionStore);

  myCourses() {
    const me = this.session.user();
    if (!me) return this.http.get<any[]>('/courses?authorId=__none__');
    return this.http.get<any[]>(`/courses?authorId=${me.id}`);
  }

  createCourse(data: NewCoursePayload) {
    const me = this.session.user();
    const id = 'c' + Math.random().toString(36).slice(2, 8);
    const body = {
      id,
      ...data,
      rating: data.rating ?? 0,
      reviews: data.reviews ?? 0,
      enrollments: data.enrollments ?? 0,
      authorId: me?.id ?? 'unknown',
      authorName: me?.name ?? 'Unknown',
      createdAt: new Date().toISOString(),
    };
    return this.http.post('/courses', body);
  }

  // simple helpers for tabs
  filterByStatus(list: any[], status: string) {
    return (list || []).filter((c) => c.status === status);
  }

  search(list: any[], q: string) {
    const s = (q || '').toLowerCase().trim();
    if (!s) return list;
    return list.filter(
      (c) => c.title.toLowerCase().includes(s) || (c.provider || '').toLowerCase().includes(s)
    );
  }
}
