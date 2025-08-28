import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.gaurd';
import { AdminAuthorGuard } from './core/auth/admin-author.gaurd';
import { AdminGuard } from './core/auth/admin.gaurd';

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
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'course/:courseId/lecture/:lectureId',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/course-player/course-player.component').then(
        (m) => m.CoursePlayerComponent
      ),
  },
  {
    path: 'author',
    canActivate: [AuthGuard, AdminAuthorGuard],
    loadComponent: () =>
      import('./features/authoring/my-courses.component').then((m) => m.MyCoursesComponent),
  },
  {
    path: 'author/new',
    canActivate: [AuthGuard, AdminAuthorGuard],
    loadComponent: () =>
      import('./features/authoring/create-course.component').then((m) => m.CreateCourseComponent),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadComponent: () =>
      import('./features/admin/admin-console.component').then((m) => m.AdminConsoleComponent),
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
