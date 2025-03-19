import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostView } from './entities/post-view.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { RoleGuard } from '../authorization/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, PostView, Comment])],
  controllers: [PostsController],
  providers: [PostsService, RoleGuard, JwtService, Reflector],
  exports: [PostsService],
})
export class PostsModule {}
