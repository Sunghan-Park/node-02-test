import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'comment 내용' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
