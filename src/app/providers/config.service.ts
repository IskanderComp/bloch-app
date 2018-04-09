import { Injectable } from '@angular/core';
import config from './../api.config.json';

let envConfig;

if (process.env) {
  envConfig = config.development;
  if (process.env.ENV && process.env.ENV === 'production') {
    envConfig = config.production;
  }
}
export const configObject = envConfig;

@Injectable()
export class ConfigService {
  public configValues: any;
  constructor() {
    this.configValues = Object.assign({}, envConfig);
  }
}
