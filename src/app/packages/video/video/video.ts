import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.html',
  styleUrl: './video.css',
})
export class Video {
  url = input.required<string>();
  size = input.required<{ width: number; height: number }>();

  container = viewChild.required<ElementRef<HTMLCanvasElement>>('container');
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  resizeCanvas() {
    const aspect = this.size().width / this.size().height;

    const parentWidth = this.container().nativeElement.clientWidth;
    const parentHeight = this.container().nativeElement.clientHeight;

    let newWidth = parentWidth;
    let newHeight = parentWidth / aspect;

    if (newHeight > parentHeight) {
      newHeight = parentHeight;
      newWidth = parentHeight * aspect;
    }

    this.canvas().nativeElement.style.width = newWidth + 'px';
    this.canvas().nativeElement.style.height = newHeight + 'px';
  }

  saveFrame() {
    // const dataURL = this.canvas().toDataURL('image/jpg');
    //
    // // Create a download link
    // const a = document.createElement('a');
    // a.href = dataURL;
    // a.download = 'frame.png';
    // a.click();
  }

  constructor() {
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  ngOnInit() {
    new JSMpeg.Player(this.url(), {
      canvas: this.canvas().nativeElement,
      preserveDrawingBuffer: true,
      onVideoDecode: () => {
        // videoPlayed = true;
        // canvas.width = 500
        // canvas.height = 100
      },
    });

    this.resizeCanvas();
  }
}
