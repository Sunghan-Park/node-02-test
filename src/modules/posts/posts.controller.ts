import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ListAllPostDto } from './dto/list-all-post.dto';
import { Roles } from '../authorization/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { RoleGuard } from '../authorization/guards/roles.guard';

@Controller('posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @Roles(UserRole.ADMIN)
  create(@Body() createPostDto: CreatePostDto, @RequestUser() user: User) {
    return this.postsService.createPost(createPostDto, user);
  }

  @Get()
  @ApiQuery({ type: ListAllPostDto })
  findAll(@Query() listAllPostDto: ListAllPostDto) {
    return this.postsService.findAll(listAllPostDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @RequestUser() user: User) {
    return this.postsService.findOne(id, user);
  }

  // @Patch(':id')
  // @ApiParam({ name: 'id', type: String })
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(id, updatePostDto);
  // }

  // @Delete(':id')
  // @ApiParam({ name: 'id', type: String })
  // remove(@Param('id') id: string) {
  //   return this.postsService.remove(id);
  // }
}
