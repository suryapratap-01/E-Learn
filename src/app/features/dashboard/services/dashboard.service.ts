import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpService } from '../../../core/api/http.service';
import { SessionStore } from '../../../core/state/session.store';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpService);
  private session = inject(SessionStore);

  private _stats = signal({ goals: 3, enrolled: 0, certificates: 0 });
  readonly stats = computed(() => this._stats());

  loadStats() {
    const user = this.session.user();
    if (!user) return;

    this.http.get<any[]>(`/enrollments?userId=${user.id}`).subscribe({
      next: (enrollments) => {
        const enrolled = Array.isArray(enrollments) ? enrollments.length : 0;
        this.http.get<any[]>(`/progress?userId=${user.id}`).subscribe({
          next: (progress) => {
            const certificates = (Array.isArray(progress) ? progress : []).filter(
              (p) => !!p.certificateEarned
            ).length;
            this._stats.set({ goals: 3, enrolled, certificates });
          },
        });
      },
    });
  }
}
