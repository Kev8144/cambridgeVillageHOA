import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContentService, FaqItem } from '../../core/content';

@Component({
  selector: 'app-faq',
  imports: [TranslatePipe],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);

  items = signal<FaqItem[]>([]);
  loading = signal(true);
  error = signal(false);
  search = signal('');

  filteredItems = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.items();
    return this.items().filter(i =>
      i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q));
  });

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(false);
    this.content.getFaq(this.lang).subscribe({
      next: items => { this.items.set(items); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }
}
