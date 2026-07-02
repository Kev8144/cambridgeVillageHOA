import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  translate = inject(TranslateService);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }
  private http = inject(HttpClient);

  formName = signal('');
  formEmail = signal('');
  formMessage = signal('');
  submitted = signal(false);

  submit(event: Event): void {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', this.formName());
    formData.append('email', this.formEmail());
    formData.append('message', this.formMessage());
    this.http.post('https://formspree.io/f/mdoqzajr', formData).subscribe({
      next: () => this.submitted.set(true),
      error: () => this.submitted.set(true)
    });
  }
}
