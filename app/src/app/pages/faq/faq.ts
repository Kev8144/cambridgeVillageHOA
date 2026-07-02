import { Component, inject, signal, OnInit } from '@angular/core';
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

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.content.getFaq(this.lang).subscribe(items => this.items.set(items));
  }
}
