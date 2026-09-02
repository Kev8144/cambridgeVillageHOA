import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdminService, ApiPost } from '../../../core/admin.service';

@Component({
  selector: 'app-posts-manage',
  imports: [TranslatePipe],
  templateUrl: './posts-manage.html',
})
export class PostsManage implements OnInit {
  private admin = inject(AdminService);
  private translate = inject(TranslateService);

  items = signal<ApiPost[]>([]);
  editing = signal<ApiPost | null>(null);
  showForm = signal(false);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void { this.load(); }

  load(): void { this.admin.getPosts().subscribe(d => this.items.set(d)); }

  add(): void {
    this.editing.set({ slug: '', titleEn: '', titleEs: '', bodyEn: '', bodyEs: '', image: '', date: new Date().toISOString().slice(0, 10), tags: '', images: '' });
    this.showForm.set(true);
  }

  edit(item: ApiPost): void { this.editing.set({ ...item }); this.showForm.set(true); }

  cancel(): void { this.showForm.set(false); this.editing.set(null); }

  save(): void {
    const item = this.editing()!;
    const op = item.id ? this.admin.updatePost(item.id, item) : this.admin.createPost(item);
    op.subscribe(() => { this.cancel(); this.load(); });
  }

  remove(id: number): void {
    this.admin.deletePost(id).subscribe(() => this.load());
  }

  setField(field: string, value: string): void {
    this.editing.set({ ...this.editing()!, [field]: value });
  }
  upload(field: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.admin.uploadFile(file).subscribe(res => this.setField(field, res.path));
  }

  gallery(): string[] {
    const raw = this.editing()?.images ?? '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  private setGallery(urls: string[]): void {
    this.setField('images', urls.join(','));
  }

  /** Upload one or more files: append each to the gallery and adopt the first as cover if unset. */
  uploadGallery(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;
    files.forEach(file => {
      this.admin.uploadFile(file).subscribe(res => {
        const current = this.gallery();
        this.setGallery([...current, res.path]);
        if (!this.editing()?.image) this.setField('image', res.path);
      });
    });
    (event.target as HTMLInputElement).value = '';
  }

  setCover(url: string): void { this.setField('image', url); }

  removeFromGallery(url: string): void {
    this.setGallery(this.gallery().filter(u => u !== url));
    if (this.editing()?.image === url) this.setField('image', '');
  }

  insertImage(field: 'bodyEn' | 'bodyEs', url: string): void {
    const current = (this.editing() as any)?.[field] ?? '';
    const tag = `<div class="responsive-thumbnail"><a href="${url}" target="_blank"><img src="${url}" alt="" loading="lazy" /></a></div>`;
    this.setField(field, current + (current ? '\n' : '') + tag);
  }
}
