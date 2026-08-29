import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService } from '../../../core/admin.service';

@Component({
  selector: 'app-residents-manage',
  imports: [TranslatePipe],
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

  ngOnInit(): void { this.load(); this.admin.getHomes().subscribe(h => this.homes.set(h)); }
  load(): void { this.admin.getResidents().subscribe(d => this.items.set(d)); }

  invite(): void {
    this.admin.inviteResident({
      email: this.inviteEmail(), name: this.inviteName(), role: this.inviteRole(),
      position: this.invitePosition() || undefined, homeId: this.inviteHomeId() ?? undefined
    }).subscribe(() => {
      this.showInvite.set(false);
      this.inviteEmail.set('');
      this.inviteName.set('');
      this.invitePosition.set('');
      this.inviteHomeId.set(null);
      this.load();
    });
  }

  toggle(id: number): void {
    this.admin.toggleResident(id).subscribe(() => this.load());
  }
}
