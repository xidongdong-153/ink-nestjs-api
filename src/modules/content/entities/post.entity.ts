import { Exclude, Expose } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PostBodyType } from '@/modules/content/constants';

@Exclude()
@Entity('content_posts')
export class PostEntity extends BaseEntity {
    @Expose()
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: '36' })
    id: string;

    @Expose()
    @Column({ comment: '文章标题' })
    title: string;

    @Expose({ groups: ['post-detail'] })
    @Column({ comment: '文章内容', type: 'text' })
    body: string;

    @Expose()
    @Column({ comment: '文章摘要', nullable: true })
    summary: string;

    @Expose()
    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    @Expose()
    @Column({ comment: '文章类型', type: 'varchar', default: PostBodyType.MD })
    type: PostBodyType;

    @Expose()
    @Column({ comment: '发布时间', type: 'varchar', nullable: true })
    publishedAt?: Date | null;

    @Expose()
    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;

    @Expose()
    @UpdateDateColumn({ comment: '更新时间' })
    updatedAt: Date;

    @Expose()
    @Column({ comment: '文章自定义排序', default: 0 })
    customOrder: number;
}
