import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class CommentRoleGuard implements CanActivate {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: User }>();
    const user = request.user;
    const commentId = request.params.comment;

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }

    if (comment.user.id !== user.id) {
      throw new ForbiddenException('댓글 수정 권한이 없습니다.');
    }

    return true;
  }
}
