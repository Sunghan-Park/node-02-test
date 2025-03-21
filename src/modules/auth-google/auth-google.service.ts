import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGoogleService {
  constructor(private readonly configService: ConfigService) {}
}
