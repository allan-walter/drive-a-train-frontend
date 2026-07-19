import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Config } from '../../common/config';
import { VideoService } from '../video-page/video-service';
import { form, FormField, max, min } from '@angular/forms/signals';
import { ThrottleService } from '../throttle-service';

@Component({
  selector: 'app-throttle',
  imports: [FormField],
  templateUrl: './throttle.html',
  styleUrl: './throttle.css',
})
export class Throttle {
  config = inject(Config);
  throttleService = inject(ThrottleService);
  videoService = inject(VideoService);

  constructor() {}

  couple(unitId: number, target: 'FRONT' | 'BACK') {
    // const body = {
    //   unitId: unitId,
    //   target: target
    // };
    // stompService.send('/app/couple', body);
  }
}

type ThrottleForm = {
  value: number;
  override: boolean;
  direction: 'forward' | 'reverse';
};
