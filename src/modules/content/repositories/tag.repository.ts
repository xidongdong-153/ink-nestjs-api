import { Repository } from 'typeorm';

import { PostEntity, TagEntity } from '@/modules/content/entities';
import { CustomRepository } from '@/modules/database/decorators';

@CustomRepository(TagEntity)
export class TagRepository extends Repository<TagEntity> {
    buildBaseQB() {
        return this.createQueryBuilder('tag')
            .leftJoinAndSelect('tag.posts', 'posts')
            .addSelect(
                (subQuery) => subQuery.select('COUNT(p.id)', 'count').from(PostEntity, 'p'),
                'postCount',
            )
            .orderBy('postCount', 'DESC')
            .loadRelationCountAndMap('tag.postCount', 'tag.posts');
    }
}
