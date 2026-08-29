import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-profile',
  imports: [TranslatePipe],
  templateUrl: './profile.html',
  styleUrl: '../../login/login.scss',
})
export class Profile implements OnInit {
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

  name = signal('');
  address = signal('');
  phone = signal('');
  currentPassword = signal('');
  newPassword = signal('');
  message = signal('');
  error = signal('');
  passwordMessage = signal('');
  passwordError = signal('');

  get lang(): string { return this.translate.currentLang() ?? 'en'; }

  ngOnInit(): void {
    const u = this.auth.user();
    if (u) {
      this.name.set(u.name);
      this.address.set(u.address ?? '');
      this.phone.set(u.phone ?? '');
    }
  }

  saveProfile(event: Event): void {
    event.preventDefault();
    this.message.set('');
    this.error.set('');
    this.auth.updateProfile({ name: this.name(), address: this.address(), phone: this.phone() }).subscribe({
      next: () => this.message.set('auth.profile_saved'),
      error: () => this.error.set('error.load_failed')
    });
  }

  changePassword(event: Event): void {
    event.preventDefault();
    this.passwordMessage.set('');
    this.passwordError.set('');
    if (this.newPassword().length < 8) {
      this.passwordError.set('auth.password_min_length');
      return;
    }
    this.auth.changePassword(this.currentPassword(), this.newPassword()).subscribe({
      next: () => {
        this.passwordMessage.set('auth.password_changed');
        this.currentPassword.set('');
        this.newPassword.set('');
      },
      error: () => this.passwordError.set('auth.password_change_error')
    });
  }
}
