import { Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { VideoService } from '../video-page/video-service';
import { LayoutBuilder } from '../../layout/layout-page/layout-builder/layout-builder';

@Component({
  selector: 'app-video',
  imports: [LayoutBuilder],
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
