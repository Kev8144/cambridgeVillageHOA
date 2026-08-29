import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ContentService, HomepageData, Post } from '../../core/content';

@Component({
  selector: 'app-home',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);

  homepage = signal<HomepageData | null>(null);
  posts = signal<Post[]>([]);
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
    this.content.getHomepage(this.lang).subscribe({
      next: d => { this.homepage.set(d); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
    this.content.getPosts(this.lang).subscribe({
      next: p => this.posts.set(p.slice(0, 4)),
      error: () => {}
    });
  }
}
