import { Injectable } from '@nestjs/common';

import { isNil, omit } from 'lodash';
import { EntityNotFoundError, In } from 'typeorm';

import {
    CreateCategoryDto,
    QueryCategoryDto,
    QueryCategoryTreeDto,
    UpdateCategoryDto,
} from '@/modules/content/dtos';
import { CategoryEntity } from '@/modules/content/entities';
import { CategoryRepository } from '@/modules/content/repositories';
import { SelectTrashMode } from '@/modules/database/constants';
import { treePaginate } from '@/modules/database/helpers';

/**
 * 分类数据操作
 */
@Injectable()
export class CategoryService {
    constructor(protected repository: CategoryRepository) {}

    /**
     * 查询分类树
     * @param options
     */
    async findTrees(options: QueryCategoryTreeDto) {
        const { trashed = SelectTrashMode.NONE } = options;

        return this.repository.findTrees({
            withTrashed: trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY,
            onlyTrashed: trashed === SelectTrashMode.ONLY,
        });
    }

    /**
     * 获取分页数据
     * @param options 分页选项
     */
    async paginate(options: QueryCategoryDto) {
        const { trashed = SelectTrashMode.NONE } = options;

        const tree = await this.repository.findTrees({
            withTrashed: trashed === SelectTrashMode.ALL || trashed === SelectTrashMode.ONLY,
            onlyTrashed: trashed === SelectTrashMode.ONLY,
        });
        const data = await this.repository.toFlatTrees(tree);

        return treePaginate(options, data);
    }

    /**
     * 获取数据详情
     * @param id
     */
    async detail(id: string) {
        return this.repository.findOneOrFail({
            where: { id },
            relations: ['parent'],
        });
    }

    /**
     * 新增分类
     * @param data
     */
    async create(data: CreateCategoryDto) {
        const item = await this.repository.save({
            ...data,
            parent: await this.getParent(undefined, data.parent),
        });

        return this.detail(item.id);
    }

    /**
     * 更新分类
     * @param data
     */
    async update(data: UpdateCategoryDto) {
        await this.repository.update(data.id, omit(data, ['id', 'parent']));
        const item = await this.detail(data.id);
        const parent = await this.getParent(item.parent?.id, data.parent);
        const sholdUpdateParent =
            (!isNil(item.parent) && !isNil(parent) && item.parent.id !== parent.id) ||
            (isNil(item.parent) && !isNil(parent)) ||
            (!isNil(item.parent) && isNil(parent));

        // 父分类单独更新
        if (parent !== undefined && sholdUpdateParent) {
            item.parent = parent;
            await this.repository.save(item, { reload: true });
        }

        return item;
    }

    /**
     * 删除分类
     * @param id
     */
    async delete(ids: string[], trash?: boolean) {
        const items = await this.repository.find({
            where: { id: In(ids) },
            withDeleted: true,
            relations: ['parent', 'children'],
        });

        // 把子分类提升一级
        for (const item of items) {
            if (!isNil(item.children) && item.children.length > 0) {
                const nchildren = [...item.children].map((c) => {
                    c.parent = item.parent;
                    return c;
                });

                await this.repository.save(nchildren);
            }
        }

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
     * 获取请求传入的父分类
     * @param current 当前分类的ID
     * @param id
     */
    protected async getParent(current?: string, parentId?: string) {
        if (current === parentId) return undefined;
        let parent: CategoryEntity | undefined;
        if (parentId !== undefined) {
            if (parentId === null) return null;
            parent = await this.repository.findOne({ where: { id: parentId } });
            if (!parent)
                throw new EntityNotFoundError(
                    CategoryEntity,
                    `Parent category ${parentId} not exists!`,
                );
        }
        return parent;
    }

    /**
     * 恢复分类
     * @param ids
     */
    async restore(ids: string[]) {
        const items = await this.repository.find({
            where: { id: In(ids) } as any,
            withDeleted: true,
        });

        const trasheds = items.filter((item) => !isNil(item)).map((item) => item.id);
        if (trasheds.length < 1) return [];
        await this.repository.restore(trasheds);
        const qb = this.repository.buildBaseQB();
        qb.andWhereInIds(trasheds);
        return qb.getMany();
    }
}
