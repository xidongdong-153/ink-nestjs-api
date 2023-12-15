import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';
import { toNumber } from 'lodash';

import { DtoValidation } from '@/modules/core/decorators';
import { SelectTrashMode } from '@/modules/database/constants';
import { PaginateOptions } from '@/modules/database/types';

/**
 * 标签分页查询验证
 */
@DtoValidation({ type: 'query' })
export class QueryTagsDto implements PaginateOptions {
    @IsEnum(SelectTrashMode)
    @IsOptional()
    trashed?: SelectTrashMode;

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
 * 标签新增验证
 */
@DtoValidation({ groups: ['create'] })
export class CreateTagDto {
    @MaxLength(25, {
        always: true,
        message: '标签名称长度最大为$constraint1',
    })
    @IsNotEmpty({ groups: ['create'], message: '标签名称不能为空' })
    @IsOptional({ groups: ['update'] })
    name: string;

    @MaxLength(255, {
        always: true,
        message: '标签描述长度最大为$constraint1',
    })
    @IsOptional({ always: true })
    description?: string;
}

/**
 * 标签更新验证
 */
@DtoValidation({ groups: ['update'] })
export class UpdateTagDto extends PartialType(CreateTagDto) {
    @IsUUID(undefined, { groups: ['update'], message: '标签ID格式不正确' })
    @IsDefined({ groups: ['update'], message: '标签ID必须指定' })
    id: string;
}
