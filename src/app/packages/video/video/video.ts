import { Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.html',
  styleUrl: './video.css',
})
export class Video {
  url = input.required<string>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {}

  ngAfterViewInit() {
    new JSMpeg.Player(this.url(), {
      canvas: this.canvas().nativeElement,
    });
  }
}
