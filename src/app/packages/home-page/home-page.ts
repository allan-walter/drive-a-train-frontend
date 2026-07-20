import { Component, inject } from '@angular/core';
import { AppService } from '../../app-service';
import { RouterLink } from '@angular/router';
import { Nav } from '../../nav/nav';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, Nav],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  appService = inject(AppService);
}
