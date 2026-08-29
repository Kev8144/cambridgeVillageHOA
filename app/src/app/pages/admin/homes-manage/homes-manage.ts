import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminService, ApiHome } from '../../../core/admin.service';
import { Paginator } from '../../../shared/paginator/paginator';

@Component({
  selector: 'app-homes-manage',
  imports: [TranslatePipe, Paginator],
  templateUrl: './homes-manage.html',
})
export class HomesManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<ApiHome[]>([]);
  editing = signal<ApiHome | null>(null);
  showForm = signal(false);

  search = signal('');
  page = signal(1);
  readonly pageSize = 10;

  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(h =>
      (h.address ?? '').toLowerCase().includes(q) ||
      (h.lotNumber ?? '').toLowerCase().includes(q) ||
      (h.residents ?? []).some(r => (r.name ?? '').toLowerCase().includes(q)));
  });
  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  ngOnInit(): void { this.load(); }
  load(): void { this.admin.getHomes().subscribe(d => this.items.set(d)); }
  onSearch(value: string): void { this.search.set(value); this.page.set(1); }
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
