import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService, ApiNewsletter } from '../../../core/admin.service';

@Component({
  selector: 'app-newsletters-manage',
  imports: [TranslatePipe],
  templateUrl: './newsletters-manage.html',
})
export class NewslettersManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<ApiNewsletter[]>([]);
  editing = signal<ApiNewsletter | null>(null);
  showForm = signal(false);

  ngOnInit(): void { this.load(); }
  load(): void { this.admin.getNewsletters().subscribe(d => this.items.set(d)); }
  add(): void { this.editing.set({ issue: 0, labelEn: '', labelEs: '', pdfPath: '', thumbnailPath: '' }); this.showForm.set(true); }
  edit(item: ApiNewsletter): void { this.editing.set({ ...item }); this.showForm.set(true); }
  cancel(): void { this.showForm.set(false); this.editing.set(null); }
  save(): void {
    const item = this.editing()!;
    const op = item.id ? this.admin.updateNewsletter(item.id, item) : this.admin.createNewsletter(item);
    op.subscribe(() => { this.cancel(); this.load(); });
  }
  remove(id: number): void { this.admin.deleteNewsletter(id).subscribe(() => this.load()); }
  setField(field: string, value: any): void { this.editing.set({ ...this.editing()!, [field]: value }); }
  upload(field: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.admin.uploadFile(file).subscribe(res => this.setField(field, res.path));
  }
}
