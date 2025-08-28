import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../services/course.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionStore } from '../../../core/state/session.store';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private search$ = new Subject<string>();
  private course = inject(CourseService);
  private auth = inject(AuthService);
  private session = inject(SessionStore);

  user = this.session.user;
  suggestions = signal<string[]>([]);
  showMenu = signal(false);
  showSuggest = signal(false);
  q = '';

  ngOnInit() {
    this.search$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((v) => this.course.searchTitles(v))
      )
      .subscribe((list) => {
        this.suggestions.set(list);
        this.showSuggest.set(!!(this.q && list.length));
      });
  }

  onInput(v: string) {
    this.q = v;
    this.search$.next(v);
  }
  clear() {
    this.q = '';
    this.suggestions.set([]);
    this.showSuggest.set(false);
  }
  toggleMenu() {
    this.showMenu.set(!this.showMenu());
  }
  // inside class HeaderComponent
  closeMenu() {
    this.showMenu.set(false);
  }

  logout() {
    this.auth.logout();
    location.href = '/auth/sign-in';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const avatarElement = target.closest('.avatar');
    if (!avatarElement && this.showMenu()) {
      this.showMenu.set(false);
    }
  }
}
