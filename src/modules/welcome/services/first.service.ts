import { Injectable } from '@nestjs/common';

@Injectable()
export class FirstService {
    useValue() {
        return 'FirstService useValue';
    }

    useId() {
        return 'FirstService 字符串提供者';
    }

    useAlias() {
        return 'FirstService 别名提供者';
    }
}
