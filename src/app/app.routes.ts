import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.gaurd';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./features/auth/sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/sign-up/sign-up.component').then((m) => m.SignUpComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
    ],
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/auth/post-login-dummy.component').then((m) => m.PostLoginDummyComponent),
  },
  { path: '**', redirectTo: '' },
];
