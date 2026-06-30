import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../packages/common/config';
import { RouterLink } from '@angular/router';
import { AppService } from '../app-service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  http = inject(HttpClient);
  config = inject(Config);
  appService = inject(AppService);

  logout() {
    this.appService.logout();
  }
}
