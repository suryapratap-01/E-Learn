import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrls: ['../auth-common.scss'],
})
export class SignInComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hide = true;
  form = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false],
  });

  submit() {
    if (this.form.invalid) return;
    const { identifier, password, remember } = this.form.value as any;
    this.auth.login(identifier, password, remember).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => alert(e.message || 'Sign in failed'),
    });
  }
}
