import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/authentication/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlingMiddleware } from './middlewares/error-handling.middleware';
import { AwsConfigModule } from './config/aws/config.module';
import { S3Module } from './modules/s3/s3.module';
import { PostsModule } from './modules/posts/posts.module';
import { AppDataSource } from './ormconfig';
import { CommentsModule } from './modules/comments/comments.module';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    AuthModule,
    AwsConfigModule,
    S3Module,
    PostsModule,
    CommentsModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*');
  }
}
