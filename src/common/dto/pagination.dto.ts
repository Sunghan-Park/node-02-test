import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export abstract class PaginationDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @ApiProperty({
    description: '페이지 번호',
    required: false,
    default: 1,
  })
  page: number = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @ApiProperty({
    description: '페이지 당 아이템 수',
    required: false,
    default: 10,
  })
  limit: number = 10;
}
