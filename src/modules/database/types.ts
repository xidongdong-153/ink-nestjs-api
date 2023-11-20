import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

/**
 * 一个查询钩子，用于修改或增强给定的查询构建器。
 * @param {SelectQueryBuilder<Entity>} qb - TypeORM的查询构建器实例。
 * @returns {Promise<SelectQueryBuilder<Entity>>} - 经过修改或增强的查询构建器实例。
 */
export type QueryHook<Entity> = (
    qb: SelectQueryBuilder<Entity>,
) => Promise<SelectQueryBuilder<Entity>>;

/**
 * 分页原数据
 */
export interface PaginateMeta {
    /**
     * 当前页项目数量
     */
    itemCount: number;

    /**
     * 项目总数量
     */
    totalItems?: number;

    /**
     * 每页显示数量
     */
    perPage: number;

    /**
     * 总页数
     */
    totalPages?: number;

    /**
     * 当前页数
     */
    currentPage: number;
}

/**
 * 分页选项
 */
export interface PaginateOptions {
    /**
     * 当前页数
     */
    page: number;

    /**
     * 每页显示数量
     */
    limit: number;
}

/**
 * 分页数据返回
 */
export interface PaginateReturn<E extends ObjectLiteral> {
    /**
     * 项目列表
     */
    items: E[];

    /**
     * 分页信息
     */
    meta: PaginateMeta;
}
