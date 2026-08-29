import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../../core/admin.service';
import { Paginator } from '../../../shared/paginator/paginator';
import { QrCode } from '../../../shared/qr-code/qr-code';

@Component({
  selector: 'app-residents-manage',
  imports: [TranslatePipe, Paginator, QrCode],
  templateUrl: './residents-manage.html',
})
export class ResidentsManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<any[]>([]);
  homes = signal<any[]>([]);
  showInvite = signal(false);
  inviteEmail = signal('');
  inviteName = signal('');
  inviteRole = signal('Resident');
  invitePosition = signal('');
  inviteHomeId = signal<number | null>(null);

  // Enrollment QR
  enrollUrl = signal('');
  enrollName = signal('');

  search = signal('');
  page = signal(1);
  readonly pageSize = 10;

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(u =>
      (u.name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.role ?? '').toLowerCase().includes(q) ||
      (u.position ?? '').toLowerCase().includes(q) ||
      (u.homeAddress ?? '').toLowerCase().includes(q));
  });
  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  ngOnInit(): void { this.load(); this.admin.getHomes().subscribe(h => this.homes.set(h)); }
  load(): void { this.admin.getResidents().subscribe(d => this.items.set(d)); }

  onSearch(value: string): void { this.search.set(value); this.page.set(1); }

  invite(): void {
    this.admin.inviteResident({
      email: this.inviteEmail(), name: this.inviteName(), role: this.inviteRole(),
      position: this.invitePosition() || undefined, homeId: this.inviteHomeId() ?? undefined
    }).subscribe(res => {
      this.showInvite.set(false);
      this.enrollName.set(this.inviteName());
      this.enrollUrl.set(res.enrollUrl);
      this.inviteEmail.set('');
      this.inviteName.set('');
      this.invitePosition.set('');
      this.inviteHomeId.set(null);
      this.load();
    });
  }

  showQr(item: any): void {
    this.admin.getInviteLink(item.id).subscribe(res => {
      this.enrollName.set(item.name);
      this.enrollUrl.set(res.enrollUrl);
    });
  }

  closeQr(): void { this.enrollUrl.set(''); this.enrollName.set(''); }

  copyLink(): void { navigator.clipboard?.writeText(this.enrollUrl()); }

  toggle(id: number): void {
    this.admin.toggleResident(id).subscribe(() => this.load());
  }
}
