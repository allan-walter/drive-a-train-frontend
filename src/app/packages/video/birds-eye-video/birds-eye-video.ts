import { Component, inject, viewChild } from '@angular/core';
import { Video } from '../video/video';
import { VideoService } from '../video-page/video-service';
import { Config } from '../../common/config';
import { Markers } from './markers/markers';

@Component({
  selector: 'app-birds-eye-video',
  imports: [Video, Markers],
  templateUrl: './birds-eye-video.html',
  styleUrl: './birds-eye-video.css',
})
export class BirdsEyeVideo {
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
