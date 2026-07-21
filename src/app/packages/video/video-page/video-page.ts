import { Component, inject, signal } from '@angular/core';
import { Data } from '../data/data';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Throttle } from '../throttle/throttle';
import { Config } from '../../common/config';
import { PovVideo } from '../pov-video/pov-video';
import { VideoService } from './video-service';
import { BirdsEyeVideo } from '../birds-eye-video/birds-eye-video';
import { ButtonOverlay } from '../button-overlay/button-overlay';
import { WS_HUBS } from '../../../hubs/base-hub';
import { InfoHub } from '../../../hubs/info-hub';

@Component({
  selector: 'app-video-page',
  imports: [Throttle, PovVideo, BirdsEyeVideo, ButtonOverlay],
  templateUrl: './video-page.html',
  styleUrl: './video-page.css',
})
export class VideoPage {
  config = inject(Config);

  videoService = inject(VideoService);
  hubs = inject(WS_HUBS);
  infoHub = inject(InfoHub);

  handler = (e: KeyboardEvent) => {
    // if (e.key === 'f') {
    //   e.preventDefault();
    //   action('functionOn');
    // } else if (e.key == 'w') {
    //   e.preventDefault();
    //   action('test2');
    // }
  };

  constructor() {
    this.hubs.forEach((h) => {
      h.start();
    });

    this.infoHub.connection.on('info', (info) => {
      this.videoService.data.update((x) => ({ ...x, info }));
      console.log(info);
      console.log(this.videoService.data().info.turnoutLocations);
    });

    window.addEventListener('keydown', this.handler, { passive: false });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handler);

    this.hubs.forEach((h) => h.dispose());
  }

  action(action: string) {
    // stompService.send('/app/debugAction', {
    //   action: action
    // });
  }

  connectionColor() {
    // switch (this.data().connection) {
    //   case 'disconnected':
    //     return 'bg-red-500';
    //   case 'connecting':
    //     return 'bg-orange-500';
    //   case 'connected':
    //     return 'bg-green-500';
    //   default:
    //     return 'bg-gray-500';
    // }
  }
}
