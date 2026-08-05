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

  ngOnInit() {}
}
