import { Component, computed, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Config } from '../../common/config';
import { VideoService } from '../video-page/video-service';
import { form, FormField, max, min } from '@angular/forms/signals';
import { ThrottleService } from '../throttle-service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDown, faStop, faUp } from '@fortawesome/pro-solid-svg-icons';
import { ThrottleHub } from '../../../hubs/throttle-hub';
import { TurnoutDebug } from './turnout-debug/turnout-debug';

@Component({
  selector: 'app-throttle',
  imports: [FormField, FaIconComponent, TurnoutDebug],
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

  protected readonly faUp = faUp;
  protected readonly faDown = faDown;
  protected readonly faStop = faStop;
}

type ThrottleForm = {
  value: number;
  override: boolean;
  direction: 'forward' | 'reverse';
};
