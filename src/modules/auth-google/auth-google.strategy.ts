import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptions } from 'passport-google-oauth20';
import { AuthService } from '../authentication/auth.service';
import { RegisterType } from '../users/enums/register-type.enum';
import { VerifiedCallback } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>('google.clientId');
    const clientSecret = configService.get<string>('google.clientSecret');
    const callbackURL = configService.get<string>('google.callbackUrl');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('Google OAuth configuration is incomplete');
    }

    const options: StrategyOptions = {
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    };

    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    try {
      // 소셜 ID로 기존 사용자 찾기
      const user = await this.usersService.findUserBySocialId(
        profile._json.sub,
        RegisterType.GOOGLE,
      );

      if (user) {
        // 기존 사용자가 있으면 반환
        return done(null, user);
      } else {
        // 기존 사용자가 없으면 새로 생성
        try {
          const newUser = await this.usersService.createUser({
            email: profile._json.email as string,
            socialId: profile._json.sub,
            name: profile._json.name || '',
            password: '',
            registerType: RegisterType.GOOGLE,
            role: UserRole.USER,
          });

          return done(null, newUser);
        } catch (createError) {
          return done(createError, false);
        }
      }
    } catch (error) {
      return done(error, false);
    }
  }
}
