import { Vector2 } from '../../data/vector2';

export class Connection {
  address: number;
  coupler: number;
  point: Vector2;

  constructor(json: any) {
    this.address = json.address;
    this.coupler = json.coupler;
    this.point = new Vector2(json.position.x, json.position.y);
  }
}
