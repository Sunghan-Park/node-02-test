import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
  @ApiProperty({ description: '제목ㅇ' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '내용ㅇ' })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({ description: '썸네일' })
  @IsString()
  @IsOptional()
  thumbnail: string;
}
