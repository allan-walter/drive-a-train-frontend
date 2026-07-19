import { effect, inject, Service, signal } from '@angular/core';
import { Config } from '../common/config';
import { VideoService } from './video-page/video-service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { form, max, min } from '@angular/forms/signals';

@Service()
export class ThrottleService {
  config = inject(Config);
  videoService = inject(VideoService);
  step = 0.05;

  connection: HubConnection;

  model = signal<ThrottleForm>({ value: 0, override: false, direction: 'forward' });
  form = form(this.model, (f) => {
    min(f.value, 0);
    max(f.value, this.videoService.data().info.maxThrottle);
  });

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.config.baseEndpoint}/hubs/throttle`)
      .build();

    this.connection.on('send', (res) => {
      this.handleLimits(res.forwardValue, res.reverseValue);
    });

    void this.connection.start();
    window.addEventListener('keydown', (e) => this.handler(e), { passive: false });

    effect(() => {
      this.model();
      this.send();
    });
  }

  handler(e: KeyboardEvent) {
    // Up and down for normal throttle. Can do super admin override with right and left which ignores any detected blockers
    const value = this.model().value;
    let reverse = this.model().direction == 'reverse';
    const step = this.step;

    if (e.key === 'ArrowUp') {
      if (value == 0) {
        reverse = false;
        this.model.update((m) => ({ ...m, direction: 'forward' }));
      }
      this.model.update((m) => ({ ...m, override: false }));

      this.delta(!reverse ? step : -step);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (value == 0) {
        reverse = true;
        this.model.update((m) => ({ ...m, direction: 'reverse' }));
      }
      this.model.update((m) => ({ ...m, override: false }));

      this.delta(reverse ? step : -step);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      if (value == 0) {
        reverse = false;
        this.model.update((m) => ({ ...m, direction: 'forward' }));
      }
      this.model.update((m) => ({ ...m, override: true }));

      this.delta(!reverse ? step : -step);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (value == 0) {
        reverse = true;
        this.model.update((m) => ({ ...m, direction: 'reverse' }));
      }
      this.model.update((m) => ({ ...m, override: true }));

      this.delta(reverse ? step : -step);
      e.preventDefault();
    } else if (e.code == 'Space') {
      this.model.update((m) => ({ ...m, override: false, value: 0 }));
      e.preventDefault();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handler);
    void this.connection.stop();
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
    console.log('consider send', this.connection.state, JSON.stringify(this.model()));
    if (this.connection.state != 'Connected') return;

    this.connection.send('setThrottle', {
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
