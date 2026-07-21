import { TurnoutLocation } from './data';

export class Info {
  width: number = 0;
  height: number = 0;
  maxThrottle: number = 0;
  throttleStep: number = 0;
  turnoutLocations!: Array<TurnoutLocation>;
}
