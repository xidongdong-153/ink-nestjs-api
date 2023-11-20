import { isNil } from 'lodash';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { PaginateOptions, PaginateReturn } from '@/modules/database/types';

/**
 * 分页函数
 * @params qb queryBuilder实例
 * @params options 分页选项
 */
export const paginate = async <E extends ObjectLiteral>(
    qb: SelectQueryBuilder<E>,
    options: PaginateOptions,
): Promise<PaginateReturn<E>> => {
    const limit = isNil(options.limit) || options.limit < 1 ? 1 : options.limit;

    const page = isNil(options.page) || options.page < 1 ? 1 : options.page;

    const start = page >= 1 ? page - 1 : 0;

    const totalItems = await qb.getCount();

    qb.take(limit).skip(start * limit);

    const items = await qb.getMany();

    const totalPages =
        totalItems % limit === 0
            ? Math.floor(totalItems / limit)
            : Math.floor(totalItems / limit) + 1;

    const remainder = totalItems % limit !== 0 ? totalItems % limit : limit;

    const itemCount = page < totalPages ? limit : remainder;

    return {
        items,
        meta: {
            totalItems,
            totalPages,
            itemCount,
            perPage: limit,
            currentPage: page,
        },
    };
};
