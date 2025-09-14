import { Component, ElementRef, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']   // corrigido: styleUrls (plural)
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('promoVideo') promoVideoRef!: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Executa apenas no browser (não no servidor)
    if (isPlatformBrowser(this.platformId)) {
      const video = this.promoVideoRef?.nativeElement;
      if (video) {
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Se o autoplay for bloqueado pelo browser
            video.muted = true;
            video.play().catch(e => console.warn('Video play failed:', e));
          });
        }
      }
    }
  }
}
