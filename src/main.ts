import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { getConfig } from './app/app.config';
import { Config } from './app/packages/common/config';

fetch('./config.json').then(async (config) => {
  const json = (await config.json()) as Config;
  bootstrapApplication(App, getConfig(json)).catch((err) => console.error(err));
});

// ng s -c garage --host="192.168.20.201"
