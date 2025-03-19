import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ListAllPostDto } from './dto/list-all-post.dto';
import { PostView } from './entities/post-view.entity';
import { OrderByOption } from './enums/order-by-option.emums';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(PostView)
    private readonly postViewsRepository: Repository<PostView>,
  ) {}

  async createPost(createPostDto: CreatePostDto, user: User) {
    try {
      const newPost = this.postsRepository.create({
        ...createPostDto,
        user: user,
      });
      await this.postsRepository.save(newPost);
      return newPost;
    } catch (error) {
      console.error('Post creation failed:', error);
      throw new InternalServerErrorException(
        `Failed to create post: ${error.message}`,
      );
    }
  }

  async findAll(listAllPostDto: ListAllPostDto) {
    const {
      page = 1,
      limit = 10,
      title,
      content,
      orderBy,
      order,
    } = listAllPostDto;
    const whereCondition: FindOptionsWhere<Post>[] = [];

    try {
      // if (title) {
      //   whereCondition.push({ title: ILike(`%${title}%`) });
      // }
      // if (content) {
      //   whereCondition.push({ content: ILike(`%${content}%`) });
      // }
      // const [data, total] = await this.postsRepository.findAndCount({
      //   relations: ['user'],
      //   where: whereCondition.length ? whereCondition : {},
      //   take: limit,
      //   skip: (page - 1) * limit,
      //   order: {
      //     createdAt: 'DESC',
      //   },
      // });
      const queryBuilder = this.postsRepository
        .createQueryBuilder('p')
        .leftJoin('p.user', 'u')
        .select([
          'p.id',
          'p.title',
          'p.createdAt',
          'u.name',
          'p.views',
          'p.likes',
        ])
        .where(whereCondition.length ? whereCondition : {})
        .orderBy('p.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      if (title) {
        queryBuilder.andWhere('p.title ILIKE: title', { title: `%${title}%` });
      }
      if (content) {
        queryBuilder.andWhere('p.content ILIKE: content', {
          content: `%${content}%`,
        });
      }
      if (orderBy && Object.values(OrderByOption).includes(orderBy)) {
        queryBuilder.orderBy(`p.${orderBy}`, order);
      }
      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      };
    } catch {
      throw new InternalServerErrorException('Failed to fetch posts');
    }
  }

  async findOne(id: string, user: User) {
    const data = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'comments'],
    });
    if (!data) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const checkPostView = await this.postViewsRepository.findOne({
      where: { user: { id: user.id }, post: { id: data.id } },
      order: { createdAt: 'DESC' },
    });

    if (
      checkPostView &&
      Date.now() - checkPostView.createdAt.getTime() > 1000 * 60 * 10
    ) {
      const postView = this.postViewsRepository.create({ post: data, user });
      await this.postViewsRepository.save(postView);

      data.views++;
      await this.postsRepository.save(data);
    }

    return data;
  }
  // async update(id: number, updatePostDto: UpdatePostDto) {
  //   await this.findOne(id);
  //   await this.postsRepository.update(id, updatePostDto);
  //   return await this.findOne(id);
  // }

  // async remove(id: number) {
  //   const post = await this.findOne(id);
  //   await this.postsRepository.remove(post);
  //   return { message: `Post with ID ${id} has been deleted` };
  // }

  async findPostById(id: string) {
    return await this.postsRepository.findOne({
      where: { id },
    });
  }
}
