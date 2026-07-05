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

}
