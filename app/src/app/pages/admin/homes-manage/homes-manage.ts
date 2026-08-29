import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminService, ApiHome } from '../../../core/admin.service';

@Component({
  selector: 'app-homes-manage',
  imports: [TranslatePipe],
  templateUrl: './homes-manage.html',
})
export class HomesManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<ApiHome[]>([]);
  editing = signal<ApiHome | null>(null);
  showForm = signal(false);

  ngOnInit(): void { this.load(); }
  load(): void { this.admin.getHomes().subscribe(d => this.items.set(d)); }
  add(): void { this.editing.set({ address: '', lotNumber: '', isActive: true }); this.showForm.set(true); }
  edit(item: ApiHome): void { this.editing.set({ ...item }); this.showForm.set(true); }
  cancel(): void { this.showForm.set(false); this.editing.set(null); }
  save(): void {
    const item = this.editing()!;
    const op = item.id ? this.admin.updateHome(item.id, item) : this.admin.createHome(item);
    op.subscribe(() => { this.cancel(); this.load(); });
  }
  remove(id: number): void { this.admin.deleteHome(id).subscribe(() => this.load()); }
  setField(field: string, value: any): void { this.editing.set({ ...this.editing()!, [field]: value }); }
}
