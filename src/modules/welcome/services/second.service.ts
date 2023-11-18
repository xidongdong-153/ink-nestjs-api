import { Injectable } from '@nestjs/common';

@Injectable()
export class SecondService {
    useClass() {
        return 'useClass - 2';
    }

    useFactory() {
        return '构造器提供者 - 1';
    }

    useAsync() {
        return '异步提供者';
    }
}
