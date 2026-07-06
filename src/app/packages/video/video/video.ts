import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { VideoService } from '../video-page/video-service';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.html',
  styleUrl: './video.css',
})
export class Video {
  type = signal<'normal' | 'debug'>('debug');
  url = input.required<string>();
  url2 = input.required<string>();
  size = input.required<{ width: number; height: number }>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  canvas2 = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas2');
  constructor() {}

  ngOnInit() {
    new JSMpeg.Player(this.url(), {
      canvas: this.canvas().nativeElement,
    });
    new JSMpeg.Player(this.url2(), {
      canvas: this.canvas2().nativeElement,
    });
  }
}
