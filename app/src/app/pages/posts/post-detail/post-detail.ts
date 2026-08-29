import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ContentService, Post } from '../../../core/content';

@Component({
  selector: 'app-post-detail',
  imports: [TranslatePipe, RouterLink, DatePipe],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.scss',
})
export class PostDetail implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);

  post = signal<Post | null>(null);
  body = signal<string>('');
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
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.content.getPosts(this.lang).subscribe({
      next: posts => this.post.set(posts.find(p => p.slug === slug) ?? null),
      error: () => {}
    });
    this.content.getPost(this.lang, slug).subscribe({
      next: data => { this.body.set(data.body); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }
}
