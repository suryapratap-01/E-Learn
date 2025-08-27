import { Injectable, signal, computed } from '@angular/core';
import type { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private _user = signal<User | null>(read('user'));
  private _token = signal<string | null>(localStorage.getItem('token'));

  readonly user = computed(() => this._user());
  readonly token = computed(() => this._token());
  readonly isAuthenticated = computed(() => !!this._token());

  setSession(user: User, token: string, remember = false) {
    this._user.set(user);
    this._token.set(token);
    if (remember) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // keep avatar/name across tabs
    }
  }

  clear() {
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }
}

function read(key: 'user'): any | null {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
