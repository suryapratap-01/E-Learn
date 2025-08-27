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
        path: 'profile',
        canActivate: [AuthGuard],
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
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
      import('./features/dashboard/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'course/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/course-details/course-details.component').then(
        (m) => m.CourseDetailsComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
