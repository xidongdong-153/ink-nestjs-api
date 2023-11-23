import {
    ClassSerializerContextOptions,
    ClassSerializerInterceptor,
    PlainLiteralObject,
    StreamableFile,
} from '@nestjs/common';
import { PinoLoggerOptions } from 'fastify/types/logger';
import { isArray, isNil, isObject } from 'lodash';

export class AppIntercepter extends ClassSerializerInterceptor {
    serialize(
        response: PlainLiteralObject | PlainLiteralObject[],
        options: ClassSerializerContextOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
        if ((!isObject(response) && !isArray(response)) || response instanceof StreamableFile) {
            return response;
        }

        // 数组处理 - 如果是数组则对数组每一项元素序列化
        if (isArray(response)) {
            return (response as PlainLiteralObject[]).map((item) =>
                !isObject(item) ? item : this.transformToPlain(item, options),
            );
        }

        // 分页处理 - 对items中的每一项进行序列化
        if ('meta' in response && 'items' in response) {
            const items = !isNil(response.items) && isArray(response.items) ? response.items : [];

            return {
                ...response,
                items: (items as PinoLoggerOptions[]).map((item) =>
                    !isObject(item) ? item : this.transformToPlain(item, options),
                ),
            };
        }

        return this.transformToPlain(response, options);
    }
}
