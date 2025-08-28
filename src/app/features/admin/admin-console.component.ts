import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from '../dashboard/header/header.component';
import { AdminService, AdminUser } from './admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-console',
  imports: [CommonModule, HeaderComponent, DatePipe],
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.scss'],
})
export class AdminConsoleComponent {
  private svc = inject(AdminService);

  q = signal('');
  users = signal<AdminUser[]>([]);
  sortBy = signal<'name' | 'joinedAt'>('name');
  sortDir = signal<'asc' | 'desc'>('asc');
  loading = signal<boolean>(true);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.svc.listUsers().subscribe((u) => {
      this.users.set(u);
      this.loading.set(false);
    });
  }

  filtered = computed(() => {
    const q = this.q().toLowerCase().trim();
    let list = this.users();

    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.roles || []).join(',').toLowerCase().includes(q)
      );
    }

    const key = this.sortBy();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...list].sort((a: any, b: any) => {
      const va = (a?.[key] || '').toString().toLowerCase();
      const vb = (b?.[key] || '').toString().toLowerCase();
      return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
    });
  });

  setSort(field: 'name' | 'joinedAt') {
    if (this.sortBy() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDir.set('asc');
    }
  }

  confirmDelete(u: AdminUser) {
    const ok = window.confirm(`Delete user "${u.name}" (${u.email})? This cannot be undone.`);
    if (!ok) return;
    this.svc.deleteUser(u.id).subscribe(() => this.refresh());
  }
}
