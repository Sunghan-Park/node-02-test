import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AppConfigModule } from 'src/config/app/config.module';
import { S3Module } from '../s3/s3.module';
import { AwsConfigModule } from 'src/config/aws/config.module';
import { PasswordUtil } from '../utils/password-util';
import { RoleGuard } from '../authorization/guards/roles.guard';

@Module({
  imports: [
    AppConfigModule,
    AwsConfigModule,
    TypeOrmModule.forFeature([User]),
    UsersModule,
    S3Module,
    JwtModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PasswordUtil, JwtStrategy, RoleGuard],
  exports: [AuthService],
})
export class AuthModule {}
