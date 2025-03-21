import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ListAllPostDto } from './dto/list-all-post.dto';
import { Roles } from '../authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RoleGuard } from '../authorization/guards/roles.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @Roles(UserRole.USER)
  create(@Body() createPostDto: CreatePostDto, @RequestUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Get()
  @ApiQuery({ type: ListAllPostDto })
  @Roles(UserRole.USER, UserRole.ADMIN)
  findAll(@Query() listAllPostDto: ListAllPostDto) {
    return this.postsService.findAll(listAllPostDto);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  findOne(@Param('id') id: string, @RequestUser() user: User) {
    return this.postsService.findOne(id, user);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @Roles(UserRole.USER, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @RequestUser() user: User,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @Roles(UserRole.USER, UserRole.ADMIN)
  remove(@Param('id') id: string, @RequestUser() user: User) {
    return this.postsService.remove(id, user);
  }
}
