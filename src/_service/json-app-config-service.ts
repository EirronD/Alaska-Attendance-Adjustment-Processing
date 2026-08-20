import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../_config/app-config';

@Injectable({
  providedIn: 'root'
})
export class JsonAppConfigService {
  private config: AppConfig | undefined;

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    return firstValueFrom(
      this.http.get<AppConfig>('/assets/appsettings.json')

    ).then(config => {
      this.config = config;
    }).catch((error) => {
      console.error('Could not load appsettings.json', error);
      console.error(error);
    });
  }

  getConfig(): AppConfig | undefined {
    return this.config;
  }
}
