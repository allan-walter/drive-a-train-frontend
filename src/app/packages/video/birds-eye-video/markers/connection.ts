import { Vector2 } from '../../data/vector2';

export class Connection {
  addressOne: number;
  addressTwo: number;
  // May not be 2 couplers, will be -1 if so
  couplerOne: number;
  couplerTwo: number;
  midpoint: Vector2;

  constructor(json: any) {
    this.addressOne = json.addressOne;
    this.addressTwo = json.addressTwo;
    this.couplerOne = json.couplerOne;
    this.couplerTwo = json.couplerTwo;
    this.midpoint = new Vector2(json.midpoint.x, json.midpoint.y);
  }
}
