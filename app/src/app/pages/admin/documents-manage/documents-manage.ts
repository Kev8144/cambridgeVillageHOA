import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService, ApiDocument } from '../../../core/admin.service';

@Component({
  selector: 'app-documents-manage',
  imports: [TranslatePipe],
  templateUrl: './documents-manage.html',
})
export class DocumentsManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<ApiDocument[]>([]);
  editing = signal<ApiDocument | null>(null);
  showForm = signal(false);

  ngOnInit(): void { this.load(); }
  load(): void { this.admin.getDocuments().subscribe(d => this.items.set(d)); }
  add(): void { this.editing.set({ titleEn: '', titleEs: '', filePath: '', labelEn: '', labelEs: '' }); this.showForm.set(true); }
  edit(item: ApiDocument): void { this.editing.set({ ...item }); this.showForm.set(true); }
  cancel(): void { this.showForm.set(false); this.editing.set(null); }
  save(): void {
    const item = this.editing()!;
    const op = item.id ? this.admin.updateDocument(item.id, item) : this.admin.createDocument(item);
    op.subscribe(() => { this.cancel(); this.load(); });
  }
  remove(id: number): void { this.admin.deleteDocument(id).subscribe(() => this.load()); }
  setField(field: string, value: string): void { this.editing.set({ ...this.editing()!, [field]: value }); }
  upload(field: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.admin.uploadFile(file).subscribe(res => this.setField(field, res.path));
  }
}
