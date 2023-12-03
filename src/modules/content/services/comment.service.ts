import { ForbiddenException, Injectable } from '@nestjs/common';

import { isNil } from 'lodash';

import { EntityNotFoundError, SelectQueryBuilder } from 'typeorm';

import { CreateCommentDto, QueryCommentDto, QueryCommentTreeDto } from '@/modules/content/dtos';
import { CommentEntity } from '@/modules/content/entities';
import { CommentRepository, PostRepository } from '@/modules/content/repositories';
import { treePaginate } from '@/modules/database/helpers';

/**
 * 评论数据操作
 */
@Injectable()
export class CommentService {
    constructor(
        protected repository: CommentRepository,
        protected postRepository: PostRepository,
    ) {}

    /**
     * 直接查询评论树
     * @param options
     */
    async findTrees(options: QueryCommentTreeDto = {}) {
        return this.repository.findTrees({
            addQuery: (qb) => {
                return isNil(options.post) ? qb : qb.where('post.id = :id', { id: options.post });
            },
        });
    }

    /**
     * 查找一篇文章的评论并分页
     * @param dto
     */
    async paginate(dto: QueryCommentDto) {
        const { post, ...query } = dto;
        const addQuery = (qb: SelectQueryBuilder<CommentEntity>) => {
            const condition: Record<string, string> = {};
            if (!isNil(post)) condition.post = post;
            return Object.keys(condition).length > 0 ? qb.andWhere(condition) : qb;
        };

        const data = await this.repository.findRoots({ addQuery });

        let comments: CommentEntity[] = [];

        for (let i = 0; i < data.length; i++) {
            const c = data[i];
            comments.push(
                await this.repository.findDescendantsTree(c, {
                    addQuery,
                }),
            );
        }
        comments = await this.repository.toFlatTrees(comments);
        return treePaginate(query, comments);
    }

    /**
     * 新增评论
     * @param data
     * @param user
     */
    async create(data: CreateCommentDto) {
        const parent = await this.getParent(undefined, data.parent);

        if (!isNil(parent) && parent.post.id !== data.post) {
            throw new ForbiddenException('Parent comment and child comment must belong same post!');
        }

        const item = await this.repository.save({
            ...data,
            parent,
            post: await this.getPost(data.post),
        });

        return this.repository.findOneOrFail({ where: { id: item.id } });
    }

    /**
     * 删除评论
     * @param id
     */
    async delete(id: string) {
        const comment = await this.repository.findOneOrFail({ where: { id: id ?? null } });
        return this.repository.remove(comment);
    }

    /**
     * 获取评论所属文章实例
     * @parem id
     */
    protected async getPost(id: string) {
        return !isNil(id) ? this.postRepository.findOneOrFail({ where: { id } }) : id;
    }

    /**
     * 获取请求传入的父分类
     * @param current 当前分类的ID
     * @param parentId
     */
    protected async getParent(current?: string, parentId?: string) {
        if (current === parentId) return undefined;
        let parent: CommentEntity | undefined;
        if (parentId !== undefined) {
            if (parentId === null) return null;
            parent = await this.repository.findOne({
                relations: ['parent', 'post'],
                where: { id: parentId },
            });
            if (!parent)
                throw new EntityNotFoundError(
                    CommentEntity,
                    `Parent comment ${parentId} not exists !`,
                );
        }

        return parent;
    }
}
