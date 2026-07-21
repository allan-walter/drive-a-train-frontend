import { Info } from './info';
import { State } from './state';

export class Data {
  info!: Info;
  forward?: string;
  reverse?: string;
  state = new State();
  connection?: 'connecting' | 'disconnected' | 'connected';
}

export type TurnoutLocation = {
  pin: number;
  x: number;
  y: number;
  rotation: number;
};
