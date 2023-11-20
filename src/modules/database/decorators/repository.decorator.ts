import { SetMetadata } from '@nestjs/common';

import { ObjectType } from 'typeorm';

import { CUSTOM_REPOSITORY_METADATA } from '@/modules/database/constants';

/**
 * 自定义存储库装饰器，用于将一个TypeORM实体类关联到一个自定义存储库类。
 * @param {ObjectType<T>} entity - TypeORM实体类，将被关联到自定义存储库。
 * @returns {ClassDecorator} - 一个类装饰器，将元数据关联到目标存储库类。
 */
export const CustomRepository = <T>(entity: ObjectType<T>): ClassDecorator =>
    SetMetadata(CUSTOM_REPOSITORY_METADATA, entity);
