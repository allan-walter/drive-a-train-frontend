import { Info } from './info';
import { State } from './state';

export class Data {
  info?: Info;
  forward?: string;
  reverse?: string;
  state = new State();
  connection?: 'connecting' | 'disconnected' | 'connected';
}
