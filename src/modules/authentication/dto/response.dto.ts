import { ApiProperty } from '@nestjs/swagger';

export class ResponseRegisterDto {
  @ApiProperty({
    description: '유저 아이디',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: '유저 이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '유저 이메일',
    example: 'test@test.com',
  })
  email: string;
  @ApiProperty({
    description: '유저 생성일',
    example: '2025-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: '유저 수정일',
    example: '2025-01-01',
  })
  updatedAt: Date;
}
