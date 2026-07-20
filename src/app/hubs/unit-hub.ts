import { BaseHub } from './base-hub';
import { Service } from '@angular/core';

@Service()
export class UnitHub extends BaseHub {
  constructor() {
    super('units');
  }
}
