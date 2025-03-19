import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class PostRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const user = request.user;
    const postId = request.params.post;

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException('게시글 수정 권한이 없습니다.');
    }

    return true;
  }
}
