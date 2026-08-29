import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/auth.service';

interface DuesRecord {
  id: number; amount: number; dueDate: string; paidDate?: string;
  status: string; reference?: string; description?: string;
}
interface DuesSummary { totalDue: number; totalPaid: number; overdue: number; recordCount: number; }

@Component({
  selector: 'app-resident-dashboard',
  imports: [TranslatePipe, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class ResidentDashboard implements OnInit {
  private http = inject(HttpClient);
  private translate = inject(TranslateService);
  auth = inject(AuthService);

  summary = signal<DuesSummary | null>(null);
  records = signal<DuesRecord[]>([]);
  loading = signal(true);
  paying = signal<number | null>(null);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.http.get<DuesSummary>('/api/dues/summary').subscribe({
      next: s => { this.summary.set(s); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
    this.http.get<DuesRecord[]>('/api/dues').subscribe({
      next: r => this.records.set(r),
      error: () => {}
    });
  }

  pay(record: DuesRecord): void {
    this.paying.set(record.id);
    this.http.post<{ url: string }>('/api/payments/checkout', { duesRecordId: record.id }).subscribe({
      next: res => window.location.href = res.url,
      error: () => this.paying.set(null)
    });
  }
}
