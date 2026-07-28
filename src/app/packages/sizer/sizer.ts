import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { VideoService } from '../video/video-page/video-service';

// Fits parent width and height, sizes to video feed aspect, and children can safely go full width and height
@Component({
  selector: 'app-sizer',
  imports: [],
  templateUrl: './sizer.html',
  styleUrl: './sizer.css',
})
export class Sizer {
  container = viewChild.required<ElementRef<HTMLCanvasElement>>('container');
  sizer = viewChild.required<ElementRef<HTMLCanvasElement>>('sizer');
  videoService = inject(VideoService);

  constructor() {}

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  ngOnDestroy() {
    // TODo
    // window.removeEventListener('resize', this.resize);
  }

  resize() {
    const container = this.container().nativeElement;
    const containerSize = container.getBoundingClientRect();
    const sizer = this.sizer().nativeElement;

    // Actual size is irrelevant it's just for the aspect ratio
    const size = this.videoService.data().info;

    const availableAspect = containerSize.width / containerSize.height;
    const aspect = size.width / size.height;
    const aspectOther = size.height / size.width;

    if (aspect > availableAspect) {
      // Tall vertical. Fit full width with extra space top and bottom
      sizer.style.width = `${containerSize.width}px`;
      const height = containerSize.width * aspectOther;
      sizer.style.height = `${height}px`;
      sizer.style.left = '';
      sizer.style.top = `${(containerSize.height - height) / 2}px`;
    } else {
      // Extra wide, Fit full height with extra space left and right
      const width = containerSize.height * aspect;
      sizer.style.width = `${width}px`;
      sizer.style.height = `${containerSize.height}px`;
      sizer.style.left = `${(containerSize.width - width) / 2}px`;
      sizer.style.top = '';
    }
  }
}
