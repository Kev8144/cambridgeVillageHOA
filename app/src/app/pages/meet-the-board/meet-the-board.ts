import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ContentService, BoardMember } from '../../core/content';

@Component({
  selector: 'app-meet-the-board',
  imports: [TranslatePipe],
  templateUrl: './meet-the-board.html',
  styleUrl: './meet-the-board.scss',
})
export class MeetTheBoard implements OnInit {
  private content = inject(ContentService);
  private translate = inject(TranslateService);

  members = signal<BoardMember[]>([]);
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
    this.content.getBoard(this.lang).subscribe({
      next: m => { this.members.set(m); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); }
    });
  }
}
