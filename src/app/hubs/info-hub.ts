import { BaseHub } from './base-hub';
import { inject, Service } from '@angular/core';
import { Subject } from 'rxjs';
import { VideoService } from '../packages/video/video-page/video-service';

@Service()
export class InfoHub extends BaseHub {
  videoService = inject(VideoService);

  constructor() {
    super('info');

    this.connection.on('info', (info) => {
      this.videoService.data.update((x) => ({ ...x, info }));
      console.log(info);
      console.log(this.videoService.data().info.turnoutLocations);
    });
  }
}
