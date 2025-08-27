import { Injectable } from '@angular/core';
import { HttpService } from '../api/http.service';
import type { User } from '../models/user.model';
import { map, of, switchMap, throwError } from 'rxjs';
import { SessionStore } from '../state/session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpService, private session: SessionStore) {}

  register(data: { name: string; email: string; password: string; username?: string }): any {
    return this.http.get<User[]>(`/users?email=${encodeURIComponent(data.email)}`).pipe(
      map((event: any) => (event && event.body ? event.body : event)), // extract body if HttpEvent
      switchMap((exists: User[]) => {
        if (exists.length) return throwError(() => new Error('Email already registered'));
        const user: Partial<User> = {
          name: data.name,
          email: data.email,
          username: data.username || data.email,
          password: data.password,
          roles: ['Learner'],
          joinedAt: new Date().toISOString(),
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}`,
        };
        return this.http.post<User>('/users', user);
      })
    );
  }

  login(identifier: string, password: string, remember: boolean) {
    // try email first
    return this.http
      .get<User[]>(
        `/users?email=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`
      )
      .pipe(
        map((event: any) => (event && event.body ? event.body : event)), // extract body if HttpEvent
        switchMap((list) =>
          list.length
            ? of(list)
            : this.http
                .get<User[]>(
                  `/users?username=${encodeURIComponent(identifier)}&password=${encodeURIComponent(
                    password
                  )}`
                )
                .pipe(map((event: any) => (event && event.body ? event.body : event)))
        ),
        map((list) => {
          const user = list[0];
          if (!user) throw new Error('Invalid username/email or password');
          const token = btoa(`${user.id}:${Date.now()}`); // demo token
          this.session.setSession(user, token, remember);
          return user;
        })
      );
  }

  logout() {
    this.session.clear();
  }
}
