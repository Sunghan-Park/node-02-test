import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { PostsService } from '../posts/posts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { ListAllCommentsDto } from './dto/list-all-comments.dto';
import { CommentRoleGuard } from './guards/comment-role.guard';
@Controller('post/:postId/comments')
@UseGuards(JwtAuthGuard)
@ApiTags('댓글')
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @ApiOperation({ summary: '댓글 생성' })
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @RequestUser() user: User,
    @Param('postId') postId: string,
  ) {
    return this.commentsService.create(createCommentDto, user, postId);
  }

  @Post(':commentId/replies')
  @ApiOperation({ summary: '대댓글 생성' })
  @ApiParam({ name: 'commentId', type: String, description: '부모 댓글 ID' })
  @ApiParam({ name: 'postId', type: String, description: '게시글 ID' })
  createReply(
    @Body() createCommentDto: CreateCommentDto,
    @Param('commentId') commentId: string,
    @Param('postId') postId: string,
    @RequestUser() user: User,
  ) {
    return this.commentsService.createReply(
      createCommentDto,
      commentId,
      postId,
      user,
    );
  }

  @ApiOperation({ summary: '댓글 목록 조회' })
  @Get()
  @ApiQuery({ type: ListAllCommentsDto })
  findAll(@Query() listAllCommentsDto: ListAllCommentsDto) {
    return this.commentsService.findAll(listAllCommentsDto);
  }

  @Get(':id')
  findCommentById(
    @Param('id') id: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    return this.commentsService.findCommentById(id, limit, page);
  }

  @UseGuards(CommentRoleGuard)
  @Patch(':commentId')
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(commentId, updateCommentDto);
  }

  @UseGuards(CommentRoleGuard)
  @Delete(':commentId')
  remove(@Param('commentId') commentId: string) {
    return this.commentsService.remove(commentId);
  }
}
