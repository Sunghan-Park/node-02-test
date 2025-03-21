import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { DatabaseConfigService } from './config/database/config.service';
import * as dotenv from 'dotenv';
import { PostViewSubscriber } from './modules/posts/subscribers/post-view.subscribe';
import { CommentSubscriber } from './modules/comments/subscribers/comment.subscriber';
dotenv.config();

const entity = join(__dirname, '/**/*.entity{.ts,.js}');
const migration = join(__dirname, './migrations/**/*{.ts,.js}');
const databaseConfigService = new DatabaseConfigService(new ConfigService());

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: databaseConfigService.host,
  port: databaseConfigService.port,
  username: databaseConfigService.username,
  password: databaseConfigService.password,
  database: databaseConfigService.database,
  synchronize: databaseConfigService.nodeEnv === 'dev',
  entities: [entity],
  migrations: [migration],
  subscribers: [PostViewSubscriber, CommentSubscriber],
});
