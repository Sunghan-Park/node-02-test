import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RequestOrigin } from 'src/decorators/request-origin.decorator';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';

@ApiTags('유저 인증')
@Controller('auth')
// @UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({
    summary: '유저 회원가입',
    description: '유저 회원가입 컨트롤러',
  })
  @ApiBody({
    type: RegisterDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '유저 회원가입 성공',
    type: ResponseRegisterDto,
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<ResponseRegisterDto> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인 컨트롤러',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유저 로그인 성공',
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @RequestOrigin() origin: string,
    @Res() res: Response,
  ) {
    const { accessToken, accessOptions, refreshToken, refreshOptions } =
      await this.authService.login(loginDto, origin);
    res.cookie('Authentication', accessToken, accessOptions);
    res.cookie('Refresh', refreshToken, refreshOptions);
    return res.json({
      message: '로그인 성공',
      accessToken,
      accessOptions,
      refreshToken,
      refreshOptions,
    });
  }

  @Post('logout')
  logout(@RequestOrigin() requestDomain: string, @Res() res: Response) {
    const { accessOptions, refreshOptions } =
      this.authService.expireJwtToken(requestDomain);
    res.clearCookie('Authentication', accessOptions);
    res.clearCookie('Refresh', refreshOptions);
    return res.json({
      message: '로그아웃 성공',
    });
  }

  // @Post('upload-profile')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadProfile(
  //   @UploadedFile() file: Express.Multer.File,
  //   @RequestUser() user: User,
  // ) {
  //   return { resultUrl: await this.authService.uploadProfile(file) };
  // }
}
