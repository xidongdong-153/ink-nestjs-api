import { Injectable } from '@nestjs/common';

import { isNil, omit } from 'lodash';

import { In, SelectQueryBuilder } from 'typeorm';

import { CreateTagDto, QueryTagsDto, UpdateTagDto } from '@/modules/content/dtos';
import { TagEntity } from '@/modules/content/entities';
import { TagRepository } from '@/modules/content/repositories';
import { SelectTrashMode } from '@/modules/database/constants';
import { paginate } from '@/modules/database/helpers';
import { QueryHook } from '@/modules/database/types';

type FindParams = {
    [key in keyof Omit<QueryTagsDto, 'limit' | 'page'>]: QueryTagsDto[key];
};

/**
 * 标签数据操作
 */
@Injectable()
export class TagService {
    constructor(protected repository: TagRepository) {}

    /**
     * 获取标签数据
     * @param options 分页选项
     * @param callback 添加额外的查询
     */
    async paginate(options: QueryTagsDto) {
        const qb = await this.buildListQuery(this.repository.buildBaseQB(), options);
        return paginate(qb, options);
    }

    /**
     * 查询单个标签信息
     * @param id
     * @param callback 添加额外的查询
     */
    async detail(id: string) {
        const qb = this.repository.buildBaseQB();
        qb.where(`tag.id = :id`, { id });
        return qb.getOneOrFail();
    }

    /**
     * 创建标签
     * @param data
     */
    async create(data: CreateTagDto) {
        const item = await this.repository.save(data);
        return this.detail(item.id);
    }

    /**
     * 更新标签
     * @param data
     */
    async update(data: UpdateTagDto) {
        await this.repository.update(data.id, omit(data, ['id']));
        return this.detail(data.id);
    }

    /**
     * 删除标签
     * @param ids
     */
    async delete(ids: string[], trash: boolean) {
        const items = await this.repository.find({
            where: { id: In(ids) } as any,
            withDeleted: true,
        });

        if (trash) {
            const directs = items.filter((item) => !isNil(item.deletedAt));
            const sorts = items.filter((item) => isNil(item.deletedAt));

            return [
                ...(await this.repository.remove(directs)),
                ...(await this.repository.softRemove(sorts)),
            ];
        }

        return this.repository.remove(items);
    }

    /**
     * 软删除标签
     * @param ids
     */
    async restore(ids: string[]) {
        const items = await this.repository.find({
            where: { id: In(ids) } as any,
            withDeleted: true,
        });

        // 过滤掉不在回收站的标签
        const trashed = items.filter((item) => !isNil(item.deletedAt)).map((item) => item.id);
        if (trashed.length < 1) return trashed;
        await this.repository.restore(trashed);
        const qb = this.repository.buildBaseQB().where({ id: In(trashed) });
        return qb.getMany();
    }

    /**
     * 构建标签列表查询器(需要查到软删除)
     * @param qb
     * @param options
     * @param callback
     */
    protected async buildListQuery(
        qb: SelectQueryBuilder<TagEntity>,
        options: FindParams,
        callback?: QueryHook<TagEntity>,
    ) {
        const { trashed } = options;

        if (trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY) {
            qb.withDeleted();
            if (trashed === SelectTrashMode.ONLY) qb.where(`tag.deletedAt IS NOT NULL`);
        }

        if (callback) return callback(qb);
        return qb;
    }
}
