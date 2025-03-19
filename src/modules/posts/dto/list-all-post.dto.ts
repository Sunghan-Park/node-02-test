import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderByOption } from '../enums/order-by-option.emums';
import { OrderOption } from '../enums/order-option.enum';
export class ListAllPostDto extends PaginationDto {
  @ApiProperty({ description: '제목', required: false })
  @IsString()
  @IsOptional()
  title: string;
  @ApiProperty({ description: '내용', required: false })
  @IsString()
  @IsOptional()
  content: string;
  @ApiProperty({ description: '작성자 ID', required: false })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    description: '정렬 기준',
    required: false,
    default: OrderByOption.CREATED_AT,
  })
  @IsString()
  @IsOptional()
  orderBy: OrderByOption = OrderByOption.CREATED_AT;

  @ApiProperty({
    description: '정렬 방향 (ASC, DESC)',
    required: false,
    enum: OrderOption,
    default: OrderOption.DESC,
  })
  @IsEnum(OrderOption)
  @IsOptional()
  order: OrderOption = OrderOption.DESC;
}
