import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class ResponseLoginDto {
  @ApiProperty({
    description: '토큰',
    example: 'token',
  })
  message: string;

  @ApiProperty({
    description: '유저 정보',
    example: 'user',
  })
  user: User;
}
