import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  translate = inject(TranslateService);
  auth = inject(AuthService);

  get lang(): string {
    return this.translate.currentLang() ?? 'en';
  }

  switchLang(lang: string): void {
    const segments = this.router.url.split('/').filter(Boolean);
    segments[0] = lang;
    this.router.navigate(['/' + segments.join('/')]);
  }

  logout(): void { this.auth.logout(); }
}
