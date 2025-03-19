import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'Test1234!',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
