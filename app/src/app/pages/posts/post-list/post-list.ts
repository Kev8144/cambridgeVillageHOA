import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ContentService, Post } from '../../../core/content';

@Component({
  selector: 'app-post-list',
  imports: [TranslatePipe, RouterLink, DatePipe],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);

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
    this.content.getPosts(this.lang).subscribe({
      next: p => { this.posts.set(p); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }
}
