import { Injectable, inject } from '@angular/core';
import { HttpService } from '../../core/api/http.service';
import { map } from 'rxjs';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  joinedAt?: string;
  avatarUrl?: string;
  bio?: string;
};

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpService);

  listUsers() {
    return this.http.get<any>('/users').pipe(map((b: unknown) => b as AdminUser[]));
  }

  deleteUser(id: string) {
    return this.http.delete(`/users/${id}`);
  }
}
