import { effect, inject, Service, signal } from '@angular/core';
import { Config } from '../common/config';
import { VideoService } from './video-page/video-service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { form, max, min } from '@angular/forms/signals';
import { ThrottleHub } from '../../hubs/throttle-hub';

@Service()
export class ThrottleService {
  config = inject(Config);
  videoService = inject(VideoService);
  throttleHub = inject(ThrottleHub);

  model = signal<ThrottleForm>({ value: 0, override: false, direction: 'forward' });
  form = form(this.model, (f) => {
    min(f.value, 0);
    max(f.value, this.videoService.data().info.maxThrottle);
  });

  constructor() {
    window.addEventListener('keydown', (e) => this.handler(e), { passive: false });

    effect(() => {
      this.model();
      this.send();
    });
  }

  up(override = false) {
    const step = this.videoService.data().info.throttleStep;
    const value = this.model().value;
    let reverse = this.model().direction == 'reverse';

    if (value == 0) {
      reverse = false;
      this.model.update((m) => ({ ...m, direction: 'forward' }));
    }
    this.model.update((m) => ({ ...m, override: override }));
    this.delta(!reverse ? step : -step);
  }

  down(override: boolean = false) {
    const step = this.videoService.data().info.throttleStep;
    const value = this.model().value;
    let reverse = this.model().direction == 'reverse';

    if (value == 0) {
      reverse = true;
      this.model.update((m) => ({ ...m, direction: 'reverse' }));
    }
    this.model.update((m) => ({ ...m, override: override }));

    this.delta(reverse ? step : -step);
  }

  stop() {
    this.model.update((m) => ({ ...m, override: false, value: 0 }));
  }

  handler(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      this.up();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      this.down();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      this.up(true);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      this.down(true);
      e.preventDefault();
    } else if (e.code == 'Space') {
      this.stop();
      e.preventDefault();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handler);
  }

  handleLimits(forwardLimit: number, reverseLimit: number) {
    // const throttle = this.throttle().nativeElement;
    // if (!this.reverse()) {
    //   throttle.valueAsNumber = Math.min(throttle.valueAsNumber, forwardLimit);
    // } else {
    //   throttle.valueAsNumber = Math.min(throttle.valueAsNumber, reverseLimit);
    // }
  }

  delta(delta: number) {
    let newValue = Number((this.model().value + delta).toFixed(2));
    newValue = Math.min(newValue, this.videoService.data().info.maxThrottle);

    this.model.update((m) => ({ ...m, value: newValue }));
  }

  send() {
    if (this.throttleHub.connection.state != 'Connected') return;

    this.throttleHub.connection.send('setThrottle', {
      value: this.model().value,
      override: this.model().override,
      reverse: this.model().direction == 'reverse',
    });
  }

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
