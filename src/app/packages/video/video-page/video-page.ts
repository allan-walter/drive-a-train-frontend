import { Component, inject, signal } from '@angular/core';
import { Data } from '../data/data';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Throttle } from '../throttle/throttle';
import { Config } from '../../common/config';
import { PovVideo } from '../pov-video/pov-video';
import { VideoService } from './video-service';
import { BirdsEyeVideo } from '../birds-eye-video/birds-eye-video';

@Component({
  selector: 'app-video-page',
  imports: [Throttle, PovVideo, BirdsEyeVideo],
  templateUrl: './video-page.html',
  styleUrl: './video-page.css',
})
export class VideoPage {
  config = inject(Config);

  videoService = inject(VideoService);

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
    this.infoHub();
    this.cropHub();

    window.addEventListener('keydown', this.handler, { passive: false });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handler);
  }

  infoHub() {
    let connection = new HubConnectionBuilder()
      .withUrl(`${this.config.baseEndpoint}/hubs/info`)
      .build();

    connection.on('info', (info) => {
      this.videoService.data.update((x) => ({ ...x, info }));
      // this.data.set({ ...this.data(), info: info });
    });

    void connection.start();
  }

  cropHub() {
    let connection = new HubConnectionBuilder()
      .withUrl(`${this.config.baseEndpoint}/hubs/crop`)
      .build();

    connection.on('send', (crop) => {
      // this.data().state = crop;
    });

    void connection.start();
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
