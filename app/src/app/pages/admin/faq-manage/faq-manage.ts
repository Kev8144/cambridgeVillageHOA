import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService, ApiFaqItem } from '../../../core/admin.service';

@Component({
  selector: 'app-faq-manage',
  imports: [TranslatePipe],
  templateUrl: './faq-manage.html',
})
export class FaqManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<ApiFaqItem[]>([]);
  editing = signal<ApiFaqItem | null>(null);
  showForm = signal(false);

  ngOnInit(): void { this.load(); }
  load(): void { this.admin.getFaq().subscribe(d => this.items.set(d)); }
  add(): void { this.editing.set({ questionEn: '', questionEs: '', answerEn: '', answerEs: '', sortOrder: this.items().length }); this.showForm.set(true); }
  edit(item: ApiFaqItem): void { this.editing.set({ ...item }); this.showForm.set(true); }
  cancel(): void { this.showForm.set(false); this.editing.set(null); }
  save(): void {
    const item = this.editing()!;
    const op = item.id ? this.admin.updateFaq(item.id, item) : this.admin.createFaq(item);
    op.subscribe(() => { this.cancel(); this.load(); });
  }
  remove(id: number): void { this.admin.deleteFaq(id).subscribe(() => this.load()); }
  setField(field: string, value: any): void { this.editing.set({ ...this.editing()!, [field]: value }); }
}
