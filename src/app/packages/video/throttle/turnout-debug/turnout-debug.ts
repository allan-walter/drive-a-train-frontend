import { Component, inject, signal } from '@angular/core';
import { UnitHub } from '../../../../hubs/unit-hub';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnout-debug',
  imports: [FormsModule],
  templateUrl: './turnout-debug.html',
  styleUrl: './turnout-debug.css',
})
export class TurnoutDebug {
  unitHub = inject(UnitHub);
  degree = signal(0);

  send() {
    this.unitHub.connection.send('debugTurnout', {
      pin: 12,
      degree: this.degree(),
    });
  }
}
