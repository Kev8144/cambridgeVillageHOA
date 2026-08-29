import { Component, input, effect, signal } from '@angular/core';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  template: `
    @if (dataUrl()) {
      <img [src]="dataUrl()" [width]="size()" [height]="size()" alt="QR code" />
    }
  `,
  styles: [`img { display: block; }`],
})
export class QrCode {
  value = input.required<string>();
  size = input<number>(220);

  dataUrl = signal<string>('');

  constructor() {
    effect(() => {
      const v = this.value();
      if (!v) { this.dataUrl.set(''); return; }
      QRCode.toDataURL(v, { width: this.size(), margin: 1 })
        .then(url => this.dataUrl.set(url))
        .catch(() => this.dataUrl.set(''));
    });
  }
}
