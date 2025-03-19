import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderByOption } from 'src/modules/posts/enums/order-by-option.emums';
import { OrderOption } from 'src/modules/posts/enums/order-option.enum';

export class ListAllCommentsDto extends PaginationDto {
  @ApiProperty({ description: 'postId' })
  postId: string;
  @ApiProperty({ description: 'userId' })
  userId: string;
  @ApiProperty({ description: 'content' })
  content: string;

  @ApiProperty({
    description: '정렬 기준',
    required: false,
    default: OrderByOption.CREATED_AT,
  })
  orderBy: OrderByOption = OrderByOption.CREATED_AT;
  @ApiProperty({
    description: '정렬 방향 (ASC, DESC)',
    required: false,
    enum: OrderOption,
    default: OrderOption.DESC,
  })
  order: OrderOption = OrderOption.DESC;
}
