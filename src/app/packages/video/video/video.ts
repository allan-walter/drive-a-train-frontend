import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { VideoService } from '../video-page/video-service';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.html',
  styleUrl: './video.css',
})
export class Video {
  url = input.required<string>();
  size = input.required<{ width: number; height: number }>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  constructor() {}

  ngOnInit() {
    new JSMpeg.Player(this.url(), {
      canvas: this.canvas().nativeElement,
    });
  }
}
