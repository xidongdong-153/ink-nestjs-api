import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { PostBodyType } from '@/modules/content/constants';

@Entity('content_posts')
export class PostEntity extends BaseEntity {
    @PrimaryColumn({ type: 'varchar', generated: 'uuid', length: '36' })
    id: string;

    @Column({ comment: '文章标题' })
    title: string;

    @Column({ comment: '文章内容', type: 'text' })
    body: string;

    @Column({ comment: '文章摘要', nullable: true })
    summary: string;

    @Column({ comment: '关键字', type: 'simple-array', nullable: true })
    keywords?: string[];

    @Column({ comment: '文章类型', type: 'varchar', default: PostBodyType.MD })
    type: PostBodyType;

    @Column({ comment: '发布时间', type: 'varchar', nullable: true })
    publishedAt?: Date | null;

    @CreateDateColumn({ comment: '创建时间' })
    createdAt: Date;

    @UpdateDateColumn({ comment: '更新时间' })
    updatedAt: Date;

    @Column({ comment: '文章自定义排序', default: 0 })
    customOrder: number;
}
