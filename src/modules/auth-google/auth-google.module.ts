import googleConfig from '../../config/google/google.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGoogleService } from './auth-google.service';
import { AuthGoogleStrategy } from './auth-google.strategy';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../authentication/auth.module';
import { AuthGoogleController } from './auth-google.controller';
import { AuthGoogleGuard } from './auth-google.guard';

@Module({
  imports: [ConfigModule.forFeature(googleConfig), UsersModule, AuthModule],
  controllers: [AuthGoogleController],
  providers: [AuthGoogleService, AuthGoogleStrategy, AuthGoogleGuard],
  exports: [AuthGoogleService, AuthGoogleStrategy],
})
export class AuthGoogleModule {}
