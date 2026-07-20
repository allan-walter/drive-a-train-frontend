import { Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowsMaximize,
  faArrowsMinimize,
  faHome,
  faPowerOff,
  faToggleOff,
  faToggleOn,
} from '@fortawesome/pro-solid-svg-icons';
import { WS_HUBS } from '../../../hubs/base-hub';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { RouterLink } from '@angular/router';
import { VideoService } from '../video-page/video-service';
import { UnitHub } from '../../../hubs/unit-hub';

@Component({
  selector: 'app-button-overlay',
  imports: [FaIconComponent, RouterLink],
  templateUrl: './button-overlay.html',
  styleUrl: './button-overlay.css',
})
export class ButtonOverlay {
  protected readonly faArrowsMaximize = faArrowsMaximize;

  hubs = inject(WS_HUBS);
  unitHub = inject(UnitHub);
  videoService = inject(VideoService);

  connectionStates = toSignal(
    combineLatest(this.hubs.map((h) => h.$isConnected)),
    { initialValue: this.hubs.map(() => false) }, // avoids undefined
  );

  isFullscreen = signal(false);

  constructor() {
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen.set(document.fullscreenElement != null);
    });
  }

  togglePower() {
    if (this.videoService.powerOn()) {
      this.unitHub.connection.send('powerOff');
    } else {
      this.unitHub.connection.send('powerOn');
    }
  }

  reconnect() {
    this.hubs.forEach((h) => h.start(true));
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  protected readonly faArrowsMinimize = faArrowsMinimize;
  protected readonly faHome = faHome;
  protected readonly faToggleOn = faToggleOn;
  protected readonly faToggleOff = faToggleOff;
}
