import { CategoryEntity } from '@/modules/content/entities';
import { BaseTreeRepository } from '@/modules/database/base';
import { OrderType, TreeChildrenResolve } from '@/modules/database/constants';
import { CustomRepository } from '@/modules/database/decorators';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends BaseTreeRepository<CategoryEntity> {
    protected _qbName = 'category';

    protected orderBy = { name: 'customOrder', order: OrderType.ASC };

    protected _childrenResolve = TreeChildrenResolve.UP;
}
