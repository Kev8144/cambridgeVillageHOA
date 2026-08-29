import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AdminService, ApiDues, ApiHome } from '../../../core/admin.service';

@Component({
  selector: 'app-dues-manage',
  imports: [TranslatePipe, CurrencyPipe, DatePipe],
  templateUrl: './dues-manage.html',
})
export class DuesManage implements OnInit {
  private admin = inject(AdminService);
  private route = inject(ActivatedRoute);

  homes = signal<ApiHome[]>([]);
  selectedHomeId = signal<number | null>(null);
  records = signal<ApiDues[]>([]);
  editing = signal<ApiDues | null>(null);
  showForm = signal(false);

  selectedHome = computed(() =>
    this.homes().find(h => h.id === this.selectedHomeId()) ?? null);

  ngOnInit(): void {
    this.admin.getHomes().subscribe(h => {
      this.homes.set(h);
      const preset = Number(this.route.snapshot.queryParamMap.get('homeId'));
      if (preset) this.selectHome(preset);
    });
  }

  selectHome(id: number): void {
    this.selectedHomeId.set(id);
    this.cancel();
    this.loadRecords();
  }

  onHomeChange(value: string): void {
    if (value) this.selectHome(+value);
  }

  loadRecords(): void {
    const id = this.selectedHomeId();
    if (!id) return;
    this.admin.getDuesForHome(id).subscribe(r => this.records.set(r));
  }

  add(): void {
    this.editing.set({
      homeId: this.selectedHomeId()!,
      amount: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      paidDate: null,
      status: 'Pending',
      reference: '',
      description: '',
    });
    this.showForm.set(true);
  }

  edit(item: ApiDues): void {
    this.editing.set({
      ...item,
      dueDate: item.dueDate?.slice(0, 10),
      paidDate: item.paidDate ? item.paidDate.slice(0, 10) : null,
    });
    this.showForm.set(true);
  }

  cancel(): void { this.showForm.set(false); this.editing.set(null); }

  save(): void {
    const item = this.editing()!;
    // Auto-set paid date when marking Paid and none provided
    if (item.status === 'Paid' && !item.paidDate) {
      item.paidDate = new Date().toISOString().slice(0, 10);
    }
    if (item.status !== 'Paid') item.paidDate = null;
    const op = item.id ? this.admin.updateDues(item.id, item) : this.admin.createDues(item);
    op.subscribe(() => { this.cancel(); this.loadRecords(); });
  }

  remove(id: number): void {
    this.admin.deleteDues(id).subscribe(() => this.loadRecords());
  }

  setField(field: string, value: any): void {
    this.editing.set({ ...this.editing()!, [field]: value });
  }
}
