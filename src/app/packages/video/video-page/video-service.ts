import { Service, signal } from '@angular/core';
import { Info } from '../data/info';
import { Data } from '../data/data';

@Service()
export class VideoService {
  data = signal<Data>(new Data());
  powerOn = signal(false);
}
