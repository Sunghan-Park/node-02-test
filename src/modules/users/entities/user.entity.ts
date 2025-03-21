import { BaseEntity } from './../../common/entities/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { UserRole } from '../enums/user-role.enum';
import { RegisterType } from '../enums/register-type.enum';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  socialId: string;

  @Column({ type: 'enum', enum: RegisterType, default: RegisterType.NORMAL })
  registerType: RegisterType;

  @Column({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
