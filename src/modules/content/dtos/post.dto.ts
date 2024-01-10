import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
    IsBoolean,
    IsDateString,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { isNil, toNumber } from 'lodash';

import { PostOrderType } from '@/modules/content/constants';
import { CategoryEntity, TagEntity } from '@/modules/content/entities';
import { DtoValidation } from '@/modules/core/decorators';
import { toBoolean } from '@/modules/core/helpers';
import { IsDataExist } from '@/modules/database/constraints';
import { PaginateWithTrashedDto } from '@/modules/restful/dtos';

/**
 * 文章分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryPostDto extends PaginateWithTrashedDto {
    /**
     * 全文搜索
     */
    @MaxLength(100, {
        always: true,
        message: '搜索字符串长度不得超过$constraint1',
    })
    @IsOptional({ always: true })
    search?: string;

    /**
     * 是否查询已发布(全部文章:不填、只查询已发布的:true、只查询未发布的:false)
     */
    @Transform(({ value }) => toBoolean(value))
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;

    /**
     * 查询结果排序,不填则综合排序
     */
    @IsEnum(PostOrderType, {
        message: `排序规则必须是${Object.values(PostOrderType).join(',')}其中一项`,
    })
    @IsOptional()
    orderBy?: PostOrderType;

    /**
     * 根据分类ID查询此分类及其后代分类下的文章
     */
    @IsDataExist(CategoryEntity, {
        always: true,
        message: '分类不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    category?: string;

    /**
     * 根据管理标签ID查询
     */
    @IsDataExist(TagEntity, {
        always: true,
        message: '标签不存在',
    })
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    tag?: string;
}

/**
 * 文章创建验证
 */
@DtoValidation({ groups: ['create'] })
export class CreatePostDto {
    /**
     * 文章标题
     */
    @MaxLength(255, {
        always: true,
        message: '文章标题长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '文章标题必须填写' })
    @IsOptional({ groups: ['update'] })
    title: string;

    /**
     * 文章内容
     */
    @IsNotEmpty({ groups: ['create'], message: '文章内容必须填写' })
    @IsOptional({ groups: ['update'] })
    body: string;

    /**
     * 文章描述
     */
    @MaxLength(500, {
        always: true,
        message: '文章描述长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    summary?: string;

    /**
     * 是否发布(发布时间)
     */
    @IsDateString({ strict: true }, { always: true })
    @IsOptional({ always: true })
    @ValidateIf((value) => !isNil(value.publishedAt))
    @Transform(({ value }) => (value === 'null' ? null : value))
    publishedAt?: Date;

    /**
     * SEO关键字
     */
    @MaxLength(20, {
        each: true,
        always: true,
        message: '每个关键字长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    keywords?: string[];

    /**
     * 自定义排序
     */
    @Transform(({ value }) => toNumber(value))
    @Min(0, { always: true, message: '排序值必须大于0' })
    @IsNumber(undefined, { always: true })
    @IsOptional({ always: true })
    customOrder = 0;

    /**
     * 所属分类ID
     */
    @IsDataExist(CategoryEntity, {
        message: '分类不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'ID格式不正确',
    })
    @IsOptional({ groups: ['update'] })
    category: string;

    /**
     * 关联标签ID
     */
    @IsDataExist(TagEntity, {
        each: true,
        always: true,
        message: '标签不存在',
    })
    @IsUUID(undefined, {
        each: true,
        always: true,
        message: 'ID格式不正确',
    })
    @IsNotEmpty({ groups: ['create'], message: '分类必须设置' })
    @IsOptional({ always: true })
    tags?: string[];
}

/**
 * 文章更新验证
 */
@DtoValidation({ groups: ['update'] })
export class UpdatePostDto extends PartialType(CreatePostDto) {
    /**
     * 待更新ID
     */
    @IsUUID(undefined, { groups: ['update'], message: '文章ID格式错误' })
    @IsDefined({ groups: ['update'], message: '文章ID必须指定' })
    id: string;
}
