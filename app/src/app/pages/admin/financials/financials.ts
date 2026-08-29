import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AdminService } from '../../../core/admin.service';
import { Paginator } from '../../../shared/paginator/paginator';

@Component({
  selector: 'app-financials',
  imports: [TranslatePipe, CurrencyPipe, Paginator, RouterLink],
  templateUrl: './financials.html',
  styleUrl: '../../../pages/resident/dashboard/dashboard.scss',
})
export class Financials implements OnInit {
  private admin = inject(AdminService);
  private translate = inject(TranslateService);
  private router = inject(Router);
  homes = signal<any[]>([]);
  loading = signal(true);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }
  get base(): string { return this.router.url.includes('/treasurer') ? 'treasurer' : 'admin'; }

  totalDue = signal(0);
  totalPaid = signal(0);
  totalOverdue = signal(0);

  search = signal('');
  page = signal(1);
  readonly pageSize = 15;

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.homes();
    return this.homes().filter(h =>
      (h.address ?? '').toLowerCase().includes(q) ||
      (h.lotNumber ?? '').toLowerCase().includes(q) ||
      (h.residents ?? []).some((r: any) => (r.name ?? '').toLowerCase().includes(q)));
  });
  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  ngOnInit(): void { this.load(); }
  onSearch(value: string): void { this.search.set(value); this.page.set(1); }

  load(): void {
    this.admin.getDuesByHome().subscribe({
      next: data => {
        this.homes.set(data);
        this.totalDue.set(data.reduce((s: number, h: any) => s + h.totalDue, 0));
        this.totalPaid.set(data.reduce((s: number, h: any) => s + h.totalPaid, 0));
        this.totalOverdue.set(data.reduce((s: number, h: any) => s + h.overdue, 0));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
