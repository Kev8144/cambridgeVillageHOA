import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContentService, Newsletter } from '../../core/content';

@Component({
  selector: 'app-newsletters',
  imports: [TranslatePipe],
  templateUrl: './newsletters.html',
  styleUrl: './newsletters.scss',
})
export class Newsletters implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);

  issues = signal<Newsletter[]>([]);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.content.getNewsletters(this.lang).subscribe(n => this.issues.set(n));
  }
}
