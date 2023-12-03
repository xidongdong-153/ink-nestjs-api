import { PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
    ValidateIf,
} from 'class-validator';

import { toNumber } from 'lodash';

import { PaginateOptions } from '@/modules/database/types';

/**
 * 评论分页查询验证
 */
export class QueryCommentDto implements PaginateOptions {
    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsOptional()
    post?: string;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '当前页数必须大于1' })
    @IsNumber()
    @IsOptional()
    page = 1;

    @Transform(({ value }) => toNumber(value))
    @Min(1, { message: '每页显示数量必须大于1' })
    @IsNumber()
    @IsOptional()
    limit: 10;
}

/**
 * 评论树查询
 */
export class QueryCommentTreeDto extends PickType(QueryCommentDto, ['post']) {}

/**
 * 评论新增验证
 */
export class CreateCommentDto {
    @MaxLength(1000, { message: '评论内容长度最大为$constraint1' })
    @IsNotEmpty({ message: '评论内容不能为空' })
    body: string;

    @IsUUID(undefined, { message: 'ID格式错误' })
    @IsDefined({ message: 'ID必须指定' })
    post: string;

    @IsUUID(undefined, { message: 'ID格式错误' })
    @ValidateIf((value) => value.parent !== null && value.parent)
    @IsOptional({ always: true })
    @Transform(({ value }) => (value === 'null' ? null : value))
    parent?: string;
}
