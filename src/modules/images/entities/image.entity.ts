import { BaseEntity } from 'src/modules/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Image extends BaseEntity {
  @Column()
  url: string;
}
