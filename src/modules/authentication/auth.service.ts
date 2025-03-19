import { UsersService } from '../users/users.service';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PasswordUtil } from '../utils/password-util';
import { ResponseRegisterDto } from './dto/response.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '../s3/s3.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly UsersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly s3Service: S3Service,
    private readonly passwordUtil: PasswordUtil,
  ) {}

  async register(registerDto: RegisterDto): Promise<ResponseRegisterDto> {
    registerDto.password = await this.passwordUtil.hashPassword(
      registerDto.password,
    );
    if (
      await this.userRepository.findOne({
        where: { email: registerDto.email },
      })
    ) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    const user = await this.UsersService.createUser(registerDto);
    return user;
  }

  async login(loginDto: LoginDto, origin: string) {
    // 1. 사용자 찾기
    console.log('Login attempt for email:', loginDto.email);
    const user = await this.UsersService.findUserByEmail(loginDto.email);
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 2. 비밀번호 검증
    console.log('Comparing passwords...');
    const isPasswordValid = await this.passwordUtil.comparePassword(
      loginDto.password,
      user.password,
    );
    console.log('Password valid:', isPasswordValid ? 'yes' : 'no');

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    // 3. 토큰 생성 및 반환
    const tokens = {
      accessToken: this.setJwtAccessToken(user, origin).accessToken,
      refreshToken: this.setJwtRefreshToken(user, origin).refreshToken,
      accessOptions: this.setCookieOptions(1000 * 60 * 60, origin),
      refreshOptions: this.setCookieOptions(1000 * 60 * 60 * 24 * 30, origin),
    };

    return tokens;
  }

  setCookieOptions(maxAge: number, requestDomain: string): CookieOptions {
    let domain: string;

    if (
      requestDomain.includes('127.0.0.1') ||
      requestDomain.includes('localhost')
    ) {
      domain = 'localhost';
    } else {
      domain = requestDomain;
    }

    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'lax',
    };
  }

  setJwtAccessToken(user: User, requestDomain: string) {
    console.log('Creating access token for user:', user);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    console.log('JWT payload:', payload);
    const maxAge = 1000 * 60 * 60 * 24;
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecretKey,
      expiresIn: '1h',
    });
    return {
      accessToken,
      accessOptions: this.setCookieOptions(maxAge, requestDomain),
    };
  }

  setJwtRefreshToken(user: User, requestDomain: string) {
    console.log('Creating refresh token for user:', user);
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    console.log('JWT payload:', payload);
    const maxAge = 1000 * 60 * 60 * 24 * 30;
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshTokenSecretKey,
      expiresIn: '30d',
    });
    return {
      refreshToken,
      refreshOptions: this.setCookieOptions(maxAge, requestDomain),
    };
  }

  expireJwtToken(requestDomain: string) {
    return {
      accessOptions: this.setCookieOptions(0, requestDomain),
      refreshOptions: this.setCookieOptions(0, requestDomain),
    };
  }

  async uploadProfile(file: Express.Multer.File) {
    // const url = await this.s3Service.uploadFile(file, 'profile');
    // return url;
  }
}
