import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../core/admin.service';

@Component({
  selector: 'app-financials',
  imports: [TranslatePipe, CurrencyPipe],
  templateUrl: './financials.html',
  styleUrl: '../../../pages/resident/dashboard/dashboard.scss',
})
export class Financials implements OnInit {
  private admin = inject(AdminService);
  homes = signal<any[]>([]);
  loading = signal(true);

  totalDue = signal(0);
  totalPaid = signal(0);
  totalOverdue = signal(0);

  ngOnInit(): void { this.load(); }

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
