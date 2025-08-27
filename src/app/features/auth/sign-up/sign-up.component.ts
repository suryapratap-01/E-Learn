import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth-common.scss'],
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hide = true;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    agree: [false, [Validators.requiredTrue]],
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;
    const { name, email, password } = this.form.value as any;
    this.auth.register({ name, email, password }).subscribe({
      next: () => this.router.navigate(['/auth/sign-in']),
      error: (e: any) => alert(e?.message ?? 'Registration failed'),
    });
  }
}
