import deepmerge from 'deepmerge';

import { isNil } from 'lodash';

/**
 * 用于请求验证中的boolean数据转义
 * @param value
 */
export const toBoolean = (value?: string | boolean): boolean => {
    if (isNil(value)) return false;

    if (typeof value === 'boolean') return value;

    try {
        return JSON.parse(value.toLowerCase());
    } catch (error) {
        return value as unknown as boolean;
    }
};

/**
 * 用于请求验证中转义null
 * @param value
 */
export const toNull = (value?: string | null): string | null | undefined => {
    return value === 'null' ? null : value;
};

/**
 * 深度合并对象
 * @param x 初始值
 * @param y 新值
 * @param arrayMode 对于数组采取的策略,`replace`为直接替换,`merge`为合并数组
 */
export const deepMerge = <T1, T2>(
    x: Partial<T1>,
    y: Partial<T2>,
    arrayMode: 'replace' | 'merge' = 'merge',
) => {
    const options: deepmerge.Options = {};

    if (arrayMode === 'replace') {
        options.arrayMerge = (target, source, _options) => source;
    } else if (arrayMode === 'merge') {
        options.arrayMerge = (target, source, _options) =>
            Array.from(new Set({ ...target, ...source }));
    }

    return deepmerge(x, y, options) as T2 extends T1 ? T1 : T1 & T2;
};
