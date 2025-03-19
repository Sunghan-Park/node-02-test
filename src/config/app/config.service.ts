import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecretKey(): string {
    const jwtKey = this.configService.get<string>('app.jwtSecretKey');
    if (!jwtKey) {
      throw new Error('JWT_SECRET_KEY is not defined in the configuration');
    }
    return jwtKey;
  }

  get jwtRefreshTokenSecretKey(): string {
    const jwtKey = this.configService.get<string>(
      'app.jwtRefreshTokenSecretKey',
    );
    if (!jwtKey) {
      throw new Error(
        'JWT_REFRESH_TOKEN_SECRET_KEY is not defined in the configuration',
      );
    }
    return jwtKey;
  }

  get port(): number {
    const port = this.configService.get<number>('app.port');
    if (!port) {
      throw new Error('PORT is not defined in the configuration');
    }
    return port;
  }
}
