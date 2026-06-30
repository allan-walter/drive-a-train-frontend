import { Component, inject } from '@angular/core';
import { AppService } from '../../app-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  appService = inject(AppService);
}
