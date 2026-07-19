import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Config } from '../../common/config';
import { VideoService } from '../video-page/video-service';
import { form, FormField, max, min } from '@angular/forms/signals';

@Component({
  selector: 'app-throttle',
  imports: [FormField],
  templateUrl: './throttle.html',
  styleUrl: './throttle.css',
})
export class Throttle {
  config = inject(Config);
  videoService = inject(VideoService);
  step = 0.05;

  connection: HubConnection;

  model = signal<ThrottleForm>({ value: 0, override: 0, direction: 'forward' });
  form = form(this.model, (f) => {
    min(f.value, 0);
    max(f.value, this.videoService.data().info.maxThrottle);

    min(f.override, 0);
    max(f.override, this.videoService.data().info.maxThrottle);
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

    computed(() => {
      this.model();
      this.send();
    });
  }

  handler(e: KeyboardEvent) {
    // Up and down for normal throttle. Can do super admin override with right and left which ignores any detected blockers
    const value = this.model().value;
    const reverse = this.model().direction == 'reverse';
    const step = this.step;

    if (e.key === 'ArrowUp') {
      if (value == 0) {
        this.model.update((m) => ({ ...m, direction: 'forward' }));
      }

      this.delta(!reverse ? step : -step, 0);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (value == 0) {
        this.model.update((m) => ({ ...m, direction: 'reverse' }));
      }

      this.delta(reverse ? step : -step, 0);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      if (value == 0) {
        this.model.update((m) => ({ ...m, direction: 'forward' }));
      }

      this.delta(0, !reverse ? step : -step);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (value == 0) {
        this.model.update((m) => ({ ...m, direction: 'reverse' }));
      }

      this.delta(0, reverse ? step : -step);
      e.preventDefault();
    } else if (e.code == 'Space') {
      this.model.update((m) => ({ ...m, value: 0, override: 0 }));
      e.preventDefault();
    }
    console.log(this.model());
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

  delta(delta: number, overrideDelta: number) {
    if (Math.abs(delta) > 0) {
      const newValue = this.model().value + delta;
      // Can't have any override if there is a normal throttle
      this.model.update((m) => ({ ...m, value: Number(newValue.toFixed(2)), override: 0 }));
    } else {
      const newValue = this.model().override + overrideDelta;
      this.model.update((m) => ({ ...m, override: newValue }));
    }

    this.send();
  }

  send() {
    this.connection.send('setThrottle', {
      value: this.model().value,
      overrideValue: this.model().override,
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
  override: number;
  direction: 'forward' | 'reverse';
};
