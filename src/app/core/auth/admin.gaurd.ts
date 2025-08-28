import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../state/session.store';

export const AdminGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);
  const roles = session.user()?.roles ?? [];
  const ok = roles.includes('Admin');

  if (!ok) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
