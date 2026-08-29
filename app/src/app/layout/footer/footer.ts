import { Component, inject, signal, computed } from '@angular/core';
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
  submitError = signal(false);
  touched = signal(false);

  nameError = computed(() => this.touched() && !this.formName().trim());
  emailError = computed(() => {
    if (!this.touched()) return '';
    const email = this.formEmail().trim();
    if (!email) return 'required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'invalid';
    return '';
  });
  messageError = computed(() => this.touched() && !this.formMessage().trim());

  submit(event: Event): void {
    event.preventDefault();
    this.touched.set(true);
    if (this.nameError() || this.emailError() || this.messageError()) return;

    this.submitError.set(false);
    const formData = new FormData();
    formData.append('name', this.formName().trim());
    formData.append('email', this.formEmail().trim());
    formData.append('message', this.formMessage().trim());
    this.http.post('https://formspree.io/f/mdoqzajr', formData).subscribe({
      next: () => this.submitted.set(true),
      error: () => this.submitError.set(true)
    });
  }
}
