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

// UI course shape used by CourseCard - matches Course interface exactly
export type UICourse = {
  id: number;
  title: string;
  provider?: string;
  thumbnailUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  badges?: ('New Launch' | 'Bestseller' | 'Highest Rated')[];
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
    id: parseInt(c.id, 10), // Convert string id to number
    title: c.title,
    provider: c.provider,
    thumbnailUrl: c.thumbnailUrl,
    level: c.level,
    durationMinutes: c.durationMinutes,
    rating: c.rating ?? 0,
    reviewCount: c.reviews ?? 0,
    enrollmentCount: c.enrollments ?? 0,
    badges: (c.badges as ('New Launch' | 'Bestseller' | 'Highest Rated')[]) ?? [],
  });

  load() {
    const me = this.session.user();
    if (!me) return;

    // 1) user profile
    this.http
      .get<AppUser>(`/users/${me.id}`)
      .pipe(
        map((event: any) => (event && event.body ? event.body : event)) // Handle HttpEvent
      )
      .subscribe((u: AppUser) => this.user.set(u));

    // 2) enrollments -> fetch those courses (single batch via query string)
    this.http
      .get<any[]>(`/enrollments?userId=${me.id}`)
      .pipe(
        map((event: any) => (event && event.body ? event.body : event)), // Handle HttpEvent
        switchMap((enrs: any[]) => {
          const ids: string[] = (enrs || []).map((e: any) => e.courseId);
          if (!ids.length) return [[] as UICourse[]];
          const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&');
          return this.http.get<ServerCourse[]>(`/courses?${qs}`).pipe(
            map((event: any) => (event && event.body ? event.body : event)), // Handle HttpEvent
            map((arr: ServerCourse[]) => (arr || []).map(this.toUI))
          );
        })
      )
      .subscribe((courses) => this.enrolledCourses.set(courses));

    // 3) progress -> learning hours (if your progress rows have durationMinutes) + certificates
    this.http
      .get<any[]>(`/progress?userId=${me.id}`)
      .pipe(
        map((event: any) => (event && event.body ? event.body : event)) // Handle HttpEvent
      )
      .subscribe((rows: any[]) => {
        const totalMinutes = (rows || []).reduce(
          (sum: number, r: any) => sum + (r.durationMinutes || 0),
          0
        );
        this.learningHours.set(Math.round(totalMinutes / 60));
        const certs = (rows || []).filter((r: any) => !!r.certificateEarned).length;
        this.certificates.set(certs);
      });
  }

  stats = computed(() => ({
    enrolled: this.enrolledCourses().length,
    learningHours: this.learningHours(),
    certificates: this.certificates(),
  }));
}
