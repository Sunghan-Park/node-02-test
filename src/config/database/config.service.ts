import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    const host = this.configService.get<string>('DATABASE_HOST');
    if (!host) {
      throw new Error('DATABASE_HOST environment variable is not set');
    }
    return host;
  }

  get port(): number {
    const port = this.configService.get<number>('DATABASE_PORT');
    if (!port) {
      throw new Error('DATABASE_PORT environment variable is not set');
    }
    return port;
  }

  get username(): string {
    const username = this.configService.get<string>('DATABASE_USERNAME');
    if (!username) {
      throw new Error('DATABASE_USERNAME environment variable is not set');
    }
    return username;
  }

  get password(): string {
    const password = this.configService.get<string>('DATABASE_PASSWORD');
    if (!password) {
      throw new Error('DATABASE_PASSWORD environment variable is not set');
    }
    return password;
  }

  get database(): string {
    const database = this.configService.get<string>('DATABASE_NAME');
    if (!database) {
      throw new Error('DATABASE_NAME environment variable is not set');
    }
    return database;
  }

  get nodeEnv(): string {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (!nodeEnv) {
      throw new Error('NODE_ENV environment variable is not set');
    }
    return nodeEnv;
  }
}
