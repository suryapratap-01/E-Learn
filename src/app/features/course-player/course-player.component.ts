import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpService } from '../../core/api/http.service';
import { HeaderComponent } from '../dashboard/header/header.component';
import { CourseService } from '../dashboard/services/course.service';
import { map, firstValueFrom } from 'rxjs';
import type { Course } from '../../core/models/course.model';

type Section = { id: string; courseId: string; title: string; summary?: string };
type Lecture = {
  id: string;
  courseId: string;
  sectionId: string;
  title: string;
  type: 'video' | 'pdf' | 'text';
  durationMinutes?: number;
  src?: string;
  html?: string;
  completed?: boolean;
};

@Component({
  standalone: true,
  selector: 'app-course-player',
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.scss'],
})
export class CoursePlayerComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpService);
  private courseSvc = inject(CourseService);
  private sanitizer = inject(DomSanitizer);

  courseId = '';
  lectureId = '';
  sections: Section[] = [];
  lectures: Lecture[] = [];
  currentLecture?: Lecture;
  safeUrl?: SafeResourceUrl;

  // New signals for tab functionality
  course = signal<Course | null>(null);
  reviews = signal<any[]>([]);
  activeTab = signal<'overview' | 'author' | 'testimonials'>('overview');

  ngOnInit() {
    // react to URL changes (when user clicks another lecture)
    this.route.paramMap.subscribe((pm) => {
      this.courseId = String(pm.get('courseId') || '');
      this.lectureId = String(pm.get('lectureId') || '');
      this.ensureDataAndSelect(this.lectureId);
      this.loadCourseData();
    });
  }

  private ensureDataAndSelect(lecId: string) {
    if (!this.sections.length) {
      this.http
        .get<Section[]>(`/sections?courseId=${this.courseId}`)
        .pipe(map((event: any) => (event && event.body ? event.body : event)))
        .subscribe((v) => (this.sections = v));
    }
    if (!this.lectures.length) {
      this.http
        .get<Lecture[]>(`/lectures?courseId=${this.courseId}`)
        .pipe(map((event: any) => (event && event.body ? event.body : event)))
        .subscribe((v: Lecture[]) => {
          this.lectures = v.sort((a, b) => a.id.localeCompare(b.id));
          this.loadYouTubeUrls().then(() => {
            this.selectLecture(lecId);
          });
        });
    } else {
      this.selectLecture(lecId);
    }
  }

  selectLecture(id: string) {
    const lec = this.lectures.find((l) => l.id === id);
    if (!lec) return;
    this.currentLecture = lec;

    console.log('Selected lecture:', lec);

    // build safe URL for video/pdf
    if (lec.type === 'video') {
      const raw = lec.src || '';
      const embed = this.convertToEmbedUrl(raw);
      console.log('Video URL conversion:', { original: raw, embed });
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
    } else if (lec.type === 'pdf') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(lec.src || '');
    } else {
      this.safeUrl = undefined;
    }
  }

  private convertToEmbedUrl(url: string): string {
    if (!url) return '';

    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already in embed format
    }

    // Fallback: return original URL
    return url;
  }

  isActive(lec: Lecture) {
    return lec.id === this.currentLecture?.id;
  }

  go(lec: Lecture) {
    // update route so back/forward works
    this.router.navigate(['/course', this.courseId, 'lecture', lec.id]);
  }

  getLecturesForSection(sectionId: string): Lecture[] {
    return this.lectures.filter((l) => l.sectionId === sectionId);
  }

  private loadCourseData() {
    if (!this.courseId) return;

    // Load course details
    this.courseSvc.getCourse(this.courseId).subscribe((c) => this.course.set(c));

    // Load reviews
    this.courseSvc.getReviews(this.courseId).subscribe((r) => this.reviews.set(r));
  }

  private async loadYouTubeUrls(): Promise<void> {
    try {
      const youtubeLinks = await firstValueFrom(
        this.http
          .get<{ id: string; url: string }[]>('/youtube-links')
          .pipe(map((event: any) => (event && event.body ? event.body : event)))
      );

      if (!youtubeLinks || youtubeLinks.length === 0) {
        console.warn('No YouTube links found');
        return;
      }

      // Map YouTube URLs to video lectures
      // Cycle through available YouTube links if there are more video lectures than links
      let youtubeIndex = 0;

      this.lectures = this.lectures.map((lecture) => {
        if (lecture.type === 'video') {
          const updatedLecture = {
            ...lecture,
            src: youtubeLinks[youtubeIndex % youtubeLinks.length].url,
          };
          youtubeIndex++;
          return updatedLecture;
        }
        return lecture;
      });

      const videoLectureCount = this.lectures.filter((l) => l.type === 'video').length;
      console.log(
        `Mapped ${videoLectureCount} video lectures using ${youtubeLinks.length} YouTube URLs (cycling as needed)`
      );
    } catch (error) {
      console.error('Failed to load YouTube URLs:', error);
      // Fallback: keep original src URLs
    }
  }

  setActiveTab(tab: 'overview' | 'author' | 'testimonials') {
    this.activeTab.set(tab);
  }

  // Helper computed properties
  durationText = computed(() => {
    const mins = this.course()?.durationMinutes ?? 0;
    if (mins >= 60) {
      return `${Math.round(mins / 60)}h ${mins % 60}m`;
    }
    return `${mins}m`;
  });

  // Helper method for encoding URI components
  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }
}
