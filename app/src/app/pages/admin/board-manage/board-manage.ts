import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService, ApiBoardMember } from '../../../core/admin.service';

@Component({
  selector: 'app-board-manage',
  imports: [TranslatePipe],
  templateUrl: './board-manage.html',
})
export class BoardManage implements OnInit {
  private admin = inject(AdminService);
  items = signal<ApiBoardMember[]>([]);
  editing = signal<ApiBoardMember | null>(null);
  showForm = signal(false);

  ngOnInit(): void { this.load(); }
  load(): void { this.admin.getBoard().subscribe(d => this.items.set(d)); }
  add(): void { this.editing.set({ role: '', name: '', email: '', photo: '', sortOrder: this.items().length }); this.showForm.set(true); }
  edit(item: ApiBoardMember): void { this.editing.set({ ...item }); this.showForm.set(true); }
  cancel(): void { this.showForm.set(false); this.editing.set(null); }
  save(): void {
    const item = this.editing()!;
    const op = item.id ? this.admin.updateBoard(item.id, item) : this.admin.createBoard(item);
    op.subscribe(() => { this.cancel(); this.load(); });
  }
  remove(id: number): void { this.admin.deleteBoard(id).subscribe(() => this.load()); }
  setField(field: string, value: any): void { this.editing.set({ ...this.editing()!, [field]: value }); }
  upload(field: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.admin.uploadFile(file).subscribe(res => this.setField(field, res.path));
  }
}
