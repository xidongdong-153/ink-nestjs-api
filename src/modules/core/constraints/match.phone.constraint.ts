import {
    ValidationArguments,
    ValidationOptions,
    isMobilePhone,
    registerDecorator,
} from 'class-validator';
import { IsMobilePhoneOptions, MobilePhoneLocale } from 'validator/lib/isMobilePhone';

/**
 * 手机号验证规则,必须是"区域号.手机号"的形式
 */
export function isMatchPhone(
    value: any,
    locale?: MobilePhoneLocale,
    options?: IsMobilePhoneOptions,
): boolean {
    if (!value) return false;

    const phoneArr: string[] = value.split('.');
    return isMobilePhone(phoneArr.join(''), locale, options);
}

/**
 * 手机号验证规则,必须是"区域号.手机号"的形式
 * @param locales 区域选项
 * @param options isMobilePhone约束选项
 * @param validationOptions class-validator库的选项
 */
export function IsMatchPhone(
    locales?: MobilePhoneLocale | MobilePhoneLocale[],
    options?: IsMobilePhoneOptions,
    validationOptions?: ValidationOptions,
) {
    return (object: RecordAny, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [locales || 'any', options],
            validator: {
                validate: (value: any, args: ValidationArguments): boolean =>
                    isMatchPhone(value, args.constraints[0], args.constraints[1]),
                defaultMessage: (_args: ValidationArguments) =>
                    '$property must be a phone number, eg: +86.12345678901',
            },
        });
    };
}
