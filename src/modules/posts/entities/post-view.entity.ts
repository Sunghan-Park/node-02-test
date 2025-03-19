import { BaseEntity } from 'src/modules/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostView extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post)
  post: Post;
}
