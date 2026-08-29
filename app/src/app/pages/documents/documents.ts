import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContentService, Document } from '../../core/content';

@Component({
  selector: 'app-documents',
  imports: [TranslatePipe],
  templateUrl: './documents.html',
  styleUrl: './documents.scss',
})
export class Documents implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);

  docs = signal<Document[]>([]);
  loading = signal(true);
  error = signal(false);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(false);
    this.content.getDocuments(this.lang).subscribe({
      next: d => { this.docs.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }
}
