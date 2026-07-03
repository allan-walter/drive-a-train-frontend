import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Config } from '../../common/config';

@Component({
  selector: 'app-throttle',
  imports: [],
  templateUrl: './throttle.html',
  styleUrl: './throttle.css',
})
export class Throttle {
  config = inject(Config);

  connection: HubConnection;
  reverse = signal(false);
  throttle = viewChild.required<ElementRef<HTMLInputElement>>('throttle');
  overrideThrottle = signal(0);

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.config.baseEndpoint}/hubs/throttle`)
      .build();

    this.connection.on('send', (res) => {
      this.handleLimits(res.forwardValue, res.reverseValue);
    });

    void this.connection.start();
    window.addEventListener('keydown', (e) => this.handler(e), { passive: false });
  }

  handler(e: KeyboardEvent) {
    // Up and down for normal throttle. Can do super admin override with right and left which ignores any detected blockers
    const throttle = this.throttle().nativeElement;
    const step = 0.05;
    console.log(e);
    if (e.key === 'ArrowUp') {
      if (throttle.valueAsNumber == 0) {
        this.reverse.set(false);
      }

      this.delta(!this.reverse() ? step : -step, 0);
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (throttle.valueAsNumber == 0) {
        this.reverse.set(true);
      }

      this.delta(this.reverse() ? step : -step, 0);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      if (throttle.valueAsNumber == 0) {
        this.reverse.set(false);
      }

      this.delta(0, !this.reverse() ? step : -step);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      if (throttle.valueAsNumber == 0) {
        this.reverse.set(true);
      }

      this.delta(0, this.reverse() ? step : -step);
      e.preventDefault();
    } else if (e.code == 'Space') {
      throttle.valueAsNumber = 0;
      this.overrideThrottle.set(0);
      this.send();
      e.preventDefault();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handler);
    void this.connection.stop();
  }

  handleLimits(forwardLimit: number, reverseLimit: number) {
    const throttle = this.throttle().nativeElement;
    if (!this.reverse()) {
      throttle.valueAsNumber = Math.min(throttle.valueAsNumber, forwardLimit);
    } else {
      throttle.valueAsNumber = Math.min(throttle.valueAsNumber, reverseLimit);
    }
  }

  delta(delta: number, overrideDelta: number) {
    if (Math.abs(delta) > 0) {
      const throttle = this.throttle().nativeElement;
      const newValue = throttle.valueAsNumber + delta;
      throttle.valueAsNumber = Number(newValue.toFixed(2));

      // Can't have any override if there is a normal throttle
      this.overrideThrottle.set(0);
    } else {
      this.overrideThrottle.update((v) => v + overrideDelta);
    }
    this.send();
  }

  send() {
    this.connection.send('setThrottle', {
      value: this.throttle().nativeElement.valueAsNumber,
      overrideValue: this.overrideThrottle(),
      reverse: this.reverse(),
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
