import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../state/session.store';

export const AdminAuthorGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);
  const user = session.user();

  const roles = user?.roles ?? [];
  const ok = roles.includes('Admin') || roles.includes('Author');

  if (!ok) {
    router.navigateByUrl('/'); // bounce to home
    return false;
  }
  return true;
};
