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

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => this.loadData());
  }

  private loadData(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.content.getPosts(this.lang).subscribe(posts => {
      this.post.set(posts.find(p => p.slug === slug) ?? null);
    });
    this.content.getPost(this.lang, slug).subscribe(data => this.body.set(data.body));
  }
}
