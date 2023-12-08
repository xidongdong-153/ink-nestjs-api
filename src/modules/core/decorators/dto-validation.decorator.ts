import { DTO_VALIDATION_OPTIONS } from '@/modules/core/constants';
import { Paramtype, SetMetadata } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

/**
 * 用于配置通过全局验证管道验证数据的DTO类装饰器
 * @params options
 */
export const DtoValidation = (
    options?: ValidatorOptions & { transformOptions?: ClassTransformOptions } & {
        type?: Paramtype;
    },
) => SetMetadata(DTO_VALIDATION_OPTIONS, options ?? {});
