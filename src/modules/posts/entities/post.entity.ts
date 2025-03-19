import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/modules/common/entities/base.entity';
import { PostView } from './post-view.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  commentCount: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => PostView, (postView) => postView.post)
  postViews: PostView[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
