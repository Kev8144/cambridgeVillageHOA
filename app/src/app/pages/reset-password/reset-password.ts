import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: '../login/login.scss',
})
export class ResetPassword {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);

  password = signal('');
  confirm = signal('');
  error = signal('');
  success = signal(false);
  loading = signal(false);
  private token = '';
  isInvite = false;

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') ?? '';
    });
    this.isInvite = this.router.url.includes('set-password');
  }

  submit(event: Event): void {
    event.preventDefault();
    this.error.set('');

    if (this.password().length < 8) {
      this.error.set('auth.password_min_length');
      return;
    }
    if (this.password() !== this.confirm()) {
      this.error.set('auth.password_mismatch');
      return;
    }

    this.loading.set(true);
    if (this.isInvite) {
      // Enrolled + auto-logged-in → go straight to their dashboard.
      this.auth.setPassword(this.token, this.password()).subscribe({
        next: () => { this.loading.set(false); this.router.navigate(['/', this.lang, 'resident']); },
        error: () => { this.error.set('auth.reset_error'); this.loading.set(false); }
      });
    } else {
      this.auth.resetPassword(this.token, this.password()).subscribe({
        next: () => { this.success.set(true); this.loading.set(false); },
        error: () => { this.error.set('auth.reset_error'); this.loading.set(false); }
      });
    }
  }
}
