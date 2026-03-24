import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SettingsService {
  constructor(private readonly configService: ConfigService) {}

  get<T = string>(key: string, defaultValue?: T): T {
    const value = this.configService.get<T>(key);
    if (value === undefined || value === null) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Setting "${key}" is not defined`);
    }
    return value;
  }

  /** Alias for get() — used for cached/hot-reload settings patterns */
  getCached<T = string>(key: string, defaultValue?: T): T {
    return this.get<T>(key, defaultValue as T);
  }
}
