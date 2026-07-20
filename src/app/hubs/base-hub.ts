import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { effect, inject, InjectionToken } from '@angular/core';
import { Config } from '../packages/common/config';
import { BehaviorSubject, firstValueFrom, Subject, timer } from 'rxjs';

export abstract class BaseHub {
  config = inject(Config);

  connection!: HubConnection;
  $isConnected = new BehaviorSubject<boolean>(false);

  protected constructor(private name: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.config.baseEndpoint}/hubs/${this.name}`)
      .withAutomaticReconnect()
      .build();

    // fires only after automatic reconnect exhausts its array and truly gives up
    this.connection.onclose(() => {
      this.$isConnected.next(false);

      // Make it look like something is happening
      setTimeout(() => {
        this.start();
      }, 2000);
    });

    this.connection.onreconnecting(() => {
      this.$isConnected.next(false);
    });

    this.connection.onreconnected(() => {
      this.$isConnected.next(true);
    });
  }

  async start(forceReconnect = false) {
    if (this.connection.state == 'Connected') {
      if (!forceReconnect) return; // already connected, nothing to do

      // On stop will auto restart.
      void this.connection.stop();
      return;
    }

    this.connection
      .start()
      .then(() => {
        this.$isConnected.next(true);
      })
      .catch(() => {
        this.$isConnected.next(false);
      });
  }

  dispose() {
    void this.connection?.stop();
  }
}

export const WS_HUBS = new InjectionToken<BaseHub[]>('WS_HUBS');
