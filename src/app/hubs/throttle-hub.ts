import { BaseHub } from './base-hub';
import { Service } from '@angular/core';
import { Subject } from 'rxjs';

@Service()
export class ThrottleHub extends BaseHub {

  constructor() {
    super('throttle');
  }
}
