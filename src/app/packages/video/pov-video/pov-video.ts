import { Component, inject, viewChild } from '@angular/core';
import { VideoService } from '../video-page/video-service';
import { Video } from '../video/video';
import { Config } from '../../common/config';

@Component({
  selector: 'app-pov-video',
  imports: [Video],
  templateUrl: './pov-video.html',
  styleUrl: './pov-video.css',
})
export class PovVideo {
  videoService = inject(VideoService);
  config = inject(Config);

  container = viewChild.required<HTMLCanvasElement>('container');
  overlay = viewChild.required<HTMLCanvasElement>('overlay');

  ngOnInit() {
    // TODO remove on destory
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const aspect = this.videoService.data().info!.width / this.videoService.data().info!.height;

    const parentWidth = this.container().clientWidth;
    const parentHeight = this.container().clientHeight;

    let newWidth = parentWidth;
    let newHeight = parentWidth / aspect;

    if (newHeight > parentHeight) {
      newHeight = parentHeight;
      newWidth = parentHeight * aspect;
    }

    this.overlay().style.width = newWidth + 'px';
    this.overlay().style.height = newHeight + 'px';
  }
}
