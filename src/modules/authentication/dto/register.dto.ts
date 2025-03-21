import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { RegisterType } from 'src/modules/users/enums/register-type.enum';
export class RegisterDto {
  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '유저 이메일',
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '유저 역할',
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: '유저 소셜 아이디',
    example: '1234567890',
  })
  @IsString()
  socialId?: string;

  @ApiProperty({
    description: '유저 소셜 타입',
    example: RegisterType.GOOGLE,
  })
  @IsEnum(RegisterType)
  registerType?: RegisterType;

  @ApiProperty({
    description: '유저 비밀번호',
    example: 'Test1234!',
  })
  @IsStrongPassword()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password?: string;
}
