import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  submit(event: Event): void {
    event.preventDefault();
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.email(), this.password()).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/', this.lang]);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('auth.login_error');
      }
    });
  }
}
