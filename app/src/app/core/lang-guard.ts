import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const SUPPORTED_LANGS = ['en', 'es'];

export const langGuard: CanActivateFn = (route) => {
  const translate = inject(TranslateService);
  const lang = route.paramMap.get('lang') ?? 'en';
  const activeLang = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  translate.use(activeLang);
  return true;
};
