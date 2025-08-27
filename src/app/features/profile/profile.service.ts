import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpService } from '../../core/api/http.service';
import { SessionStore } from '../../core/state/session.store';
import { map, switchMap } from 'rxjs';

type AppUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  joinedAt?: string;
  avatarUrl?: string;
  bio?: string;
};
type ServerCourse = {
  id: string;
  title: string;
  provider?: string;
  thumbnailUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  rating: number;
  reviews: number;
  enrollments: number;
  badges?: string[];
  skills?: string[];
  status?: string;
};

// UI course shape used by CourseCard
export type UICourse = {
  id: string;
  title: string;
  provider?: string;
  thumbnailUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  badges?: string[];
  progressPercent?: number;
};

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpService);
  private session = inject(SessionStore);

  user = signal<AppUser | null>(null);
  enrolledCourses = signal<UICourse[]>([]);
  learningHours = signal<number>(0);
  certificates = signal<number>(0);

  private toUI = (c: ServerCourse): UICourse => ({
    id: c.id,
    title: c.title,
    provider: c.provider,
    thumbnailUrl: c.thumbnailUrl,
    level: c.level,
    durationMinutes: c.durationMinutes,
    rating: c.rating ?? 0,
    reviewCount: c.reviews ?? 0,
    enrollmentCount: c.enrollments ?? 0,
    badges: c.badges ?? [],
  });

  load() {
    const me = this.session.user();
    if (!me) return;

    // 1) user profile
    this.http.get<any>(`/users/${me.id}`).subscribe((u) => this.user.set(u as AppUser));

    // 2) enrollments -> fetch those courses (single batch via query string)
    this.http
      .get<any[]>(`/enrollments?userId=${me.id}`)
      .pipe(
        switchMap((enrs) => {
          const ids: string[] = (enrs || []).map((e: any) => e.courseId);
          if (!ids.length) return [[] as UICourse[]];
          const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&');
          return this.http
            .get<any>(`/courses?${qs}`)
            .pipe(map((arr: ServerCourse[]) => (arr || []).map(this.toUI)));
        })
      )
      .subscribe((courses) => this.enrolledCourses.set(courses));

    // 3) progress -> learning hours (if your progress rows have durationMinutes) + certificates
    this.http.get<any[]>(`/progress?userId=${me.id}`).subscribe((rows) => {
      const totalMinutes = (rows || []).reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
      this.learningHours.set(Math.round(totalMinutes / 60));
      const certs = (rows || []).filter((r) => !!r.certificateEarned).length;
      this.certificates.set(certs);
    });
  }

  stats = computed(() => ({
    enrolled: this.enrolledCourses().length,
    learningHours: this.learningHours(),
    certificates: this.certificates(),
  }));
}
