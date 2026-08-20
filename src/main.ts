// /// <reference types="@angular/localize" />

// import { bootstrapApplication } from '@angular/platform-browser';

// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';

// bootstrapApplication(AppComponent, appConfig)
//   .catch(err => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app/app.component';
import { JsonAppConfigService } from '../src/_service/json-app-config-service';
import { appConfig } from './app/app.config';

export function initializerFn(jsonAppConfigService: JsonAppConfigService) {
  return () => jsonAppConfigService.load();
}

bootstrapApplication(AppComponent, {
  ...appConfig, // Spread general configuration
  providers: [
    provideHttpClient(),
    JsonAppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFn,
      deps: [JsonAppConfigService],
      multi: true
    }
  ]
}).catch(err => console.error(err));