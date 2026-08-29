import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  template: `
    @if (totalPages() > 1) {
      <nav class="paginator" aria-label="Pagination">
        <button type="button" [disabled]="page() === 1" (click)="go(page() - 1)" aria-label="Previous">‹</button>
        @for (p of pages(); track p) {
          <button type="button" [class.active]="p === page()" (click)="go(p)">{{ p }}</button>
        }
        <button type="button" [disabled]="page() === totalPages()" (click)="go(page() + 1)" aria-label="Next">›</button>
      </nav>
    }
  `,
  styles: [`
    .paginator {
      display: flex;
      justify-content: center;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin: 1.5rem 0;
    }
    button {
      min-width: 2.25rem;
      padding: 0.35rem 0.6rem;
      border: 1px solid var(--border, #e0e0e0);
      border-radius: var(--radius, 0.375rem);
      background: var(--bg, #fff);
      color: var(--fg, #474747);
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.2s ease, color 0.2s ease;
    }
    button:hover:not(:disabled) { background: var(--bg-alt, #f7f7f7); }
    button.active {
      background: var(--accent, #043006);
      color: var(--accent-fg, #fff);
      border-color: var(--accent, #043006);
    }
    button:disabled { opacity: 0.4; cursor: default; }
  `],
})
export class Paginator {
  total = input.required<number>();
  pageSize = input<number>(10);
  page = input.required<number>();
  pageChange = output<number>();

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  go(p: number): void {
    if (p >= 1 && p <= this.totalPages()) this.pageChange.emit(p);
  }
}
