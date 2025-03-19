import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@EventSubscriber()
export class CommentSubscriber implements EntitySubscriberInterface<Comment> {
  listenTo() {
    return Comment;
  }

  async afterInsert(event: InsertEvent<Comment>): Promise<void> {
    // post는 모든 댓글에 필수
    if (!event.entity.post) {
      console.error('Post is undefined');
      throw new Error('Post is required');
    }
    // parentComment가 설정된 경우, 해당 댓글이 실제로 존재하는지 확인
    if (event.entity.parentComment) {
      const commentRepository = event.manager.getRepository(Comment);
      const parentExists = await commentRepository.findOne({
        where: { id: event.entity.parentComment.id },
      });
      if (!parentExists) {
        console.error('Referenced parent comment does not exist');
        throw new Error('Referenced parent comment does not exist');
      }
    }

    const postRepository = event.manager.getRepository(Post);
    await postRepository.increment(
      { id: event.entity.post.id },
      'commentCount',
      1,
    );
  }

  async afterRemove(event: RemoveEvent<Comment>): Promise<void> {
    const postRepository = event.manager.getRepository(Post);
    // const commentRepository = event.manager.getRepository(Comment);

    // const count = await commentRepository.createQueryBuilder('comment')
    //   .select('COUNT(comment.id)', 'count')
    //   .where('comment.parentCommentId = :id', { id: event.entity.id })
    //   .getCount();

    // 삭제된 댓글의 대댓글 수를 조회
    const decrementCount = 1 + (event.entity?.replies?.length || 0);
    // 댓글 자신 + 대댓글 수만큼 commentCount 감소
    await postRepository.decrement(
      { id: event.entity?.post.id },
      'commentCount',
      decrementCount,
    );
  }
}
