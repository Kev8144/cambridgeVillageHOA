import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: '../login/login.scss',
})
export class ForgotPassword {
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

  email = signal('');
  sent = signal(false);
  loading = signal(false);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  submit(event: Event): void {
    event.preventDefault();
    this.loading.set(true);
    this.auth.forgotPassword(this.email()).subscribe({
      next: () => { this.sent.set(true); this.loading.set(false); },
      error: () => { this.sent.set(true); this.loading.set(false); }
    });
  }
}
