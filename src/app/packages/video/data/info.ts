import { TurnoutLocation } from './data';

export class Info {
  width: number = 0;
  height: number = 0;
  detectionWidth!: number;
  detectionHeight!: number;
  maxThrottle: number = 0;
  throttleStep: number = 0;
  turnoutLocations!: Array<TurnoutLocation>;
}
