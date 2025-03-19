import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from 'src/modules/posts/posts.service';
import { ListAllCommentsDto } from './dto/list-all-comments.dto';
import { OrderOption } from 'src/modules/posts/enums/order-option.enum';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User, postId: string) {
    try {
      const post = await this.postsService.findPostById(postId);
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const newComment = this.commentsRepository.create({
        content: createCommentDto.content,
        user,
        post,
      });

      await this.commentsRepository.save(newComment);
      return {
        comment: newComment.content,
        postId: post.id,
        user: user.name,
        createdAt: newComment.createdAt,
      };
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw new InternalServerErrorException(
        `Failed to create comment: ${error.message}`,
      );
    }
  }

  async createReply(
    createCommentDto: CreateCommentDto,
    commentId: string,
    postId: string,
    user: User,
  ) {
    console.log('Attempting to create reply with:', { commentId, postId });

    const parentComment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['post'],
    });

    if (!parentComment) {
      console.error(`Parent comment not found for commentId: ${commentId}`);
      throw new NotFoundException('Parent comment not found');
    }

    console.log('Found parent comment:', {
      commentId: parentComment.id,
      postId: parentComment.post.id,
      requestedPostId: postId,
    });

    if (parentComment.post.id !== postId) {
      console.error('Post ID mismatch:', {
        parentCommentPostId: parentComment.post.id,
        requestedPostId: postId,
      });
      throw new NotFoundException(
        'Comment does not belong to the specified post',
      );
    }

    const newReply = this.commentsRepository.create({
      content: createCommentDto.content,
      user,
      post: parentComment.post,
      parentComment: parentComment,
    });

    await this.commentsRepository.save(newReply);
    return {
      comment: newReply.content,
      postId: parentComment.post.id,
      parentCommentId: parentComment.id,
      user: user.name,
      createdAt: newReply.createdAt,
    };
  }

  async findAll(listAllCommentsDto: ListAllCommentsDto) {
    const {
      page = 1,
      limit = 10,
      content,
      orderBy,
      order,
    } = listAllCommentsDto;
    const whereCondition: FindOptionsWhere<Comment>[] = [];

    const queryBuilder = this.commentsRepository
      .createQueryBuilder('c')
      .leftJoin('c.post', 'p')
      .leftJoin('c.user', 'u')
      .select([
        'c.id',
        'c.content',
        'c.createdAt',
        'p.id',
        'p.title',
        'u.id',
        'u.name',
      ])
      .where(whereCondition.length ? whereCondition : {})
      .orderBy(`c.${orderBy}`, order === OrderOption.ASC ? 'ASC' : 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (content) {
      queryBuilder.andWhere('c.content ILIKE: content', {
        content: `%${content}%`,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    };
  }

  async findCommentById(postId: string, limit: number, page: number) {
    // const comment = await this.commentsRepository.find({
    //   where: { id },
    //   relations: ['replies', 'parentComment', 'post', 'user'],
    //   order: {
    //     createdAt: 'DESC',
    //   },
    //   take: 1,
    //   skip: 0,
    //   select: {
    //     id: true,
    //     content: true,
    //     createdAt: true,
    //     updatedAt: true,
    //     user: {
    //       id: true,
    //       name: true,
    //     },
    //     post: {
    //       id: true,
    //       title: true,
    //     },
    //     parentComment: {
    //       id: true,
    //       content: true,
    //     },
    //     replies: {
    //       id: true,
    //       content: true,
    //       createdAt: true,
    //       updatedAt: true,
    //       user: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });

    // if (!comment) {
    //   throw new NotFoundException('Comment not found');
    // }
    const comment = await this.commentsRepository
      .createQueryBuilder('c')
      .leftJoin('c.post', 'p')
      .leftJoin('c.user', 'u')
      .leftJoin('c.parentComment', 'pc')
      .leftJoin('c.replies', 'r')
      .leftJoin('r.user', 'ur')
      .where('c.id = :postId', { postId })
      .andWhere('c.parentCommentId IS NULL')
      .select([
        'c.id',
        'c.content',
        'c.createdAt',
        'c.updatedAt',
        'p.id',
        'p.title',
        'u.id',
        'u.name',
        'pc.id',
        'pc.content',
        'r.id',
        'r.content',
        'r.createdAt',
        'r.updatedAt',
        'ur.id',
        'ur.name',
      ])
      .orderBy('c.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getMany();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(commentId: string, updateCommentDto: UpdateCommentDto) {
    // const comment = await this.commentsRepository.findOne({
    //   where: { id: commentId },
    // });

    // if (!comment) {
    //   throw new NotFoundException('Comment not found');
    // }

    // comment.content = updateCommentDto.content;
    // await this.commentsRepository.save(comment);

    const comment = await this.commentsRepository.update(
      commentId,
      updateCommentDto,
    );

    if (comment.affected === 0) {
      throw new NotFoundException('Comment not found');
    }

    return {
      comment: updateCommentDto.content,
      message: 'Comment updated successfully',
    };
  }

  async remove(commentId: string) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['post', 'replies'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.remove(comment);
    return {
      commentId,
      message: 'Comment deleted successfully',
    };
  }
}
