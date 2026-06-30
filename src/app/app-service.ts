import { inject, Service, signal } from '@angular/core';
import { isLoggedIn } from './packages/common/auth';
import { HttpClient } from '@angular/common/http';
import { Config } from './packages/common/config';

@Service()
export class AppService {
  config = inject(Config);
  http = inject(HttpClient);
  $isLoggedIn = signal(isLoggedIn());

  updateLoginState() {
    this.$isLoggedIn.set(isLoggedIn());
  }

  logout() {
    this.http.post(`${this.config.baseEndpoint}/auth/logout`, {}).subscribe(() => {
      this.updateLoginState();
    });
  }
}
