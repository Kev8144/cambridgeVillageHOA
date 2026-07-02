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

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.loadData();
    this.translate.onLangChange.subscribe(() => this.loadData());
  }

  private loadData(): void {
    this.content.getHomepage(this.lang).subscribe(d => this.homepage.set(d));
    this.content.getPosts(this.lang).subscribe(p => this.posts.set(p.slice(0, 4)));
  }
}
