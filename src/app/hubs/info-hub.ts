import { BaseHub } from './base-hub';
import { Service } from '@angular/core';
import { Subject } from 'rxjs';

@Service()
export class InfoHub extends BaseHub {

  constructor() {
    super('info');
  }
}
