import { Injectable } from '@nestjs/common';

@Injectable()
export class ThirdService {
    useClass() {
        return 'useClass - 3';
    }

    useFactory() {
        return '构造器提供者 - 2';
    }
}
