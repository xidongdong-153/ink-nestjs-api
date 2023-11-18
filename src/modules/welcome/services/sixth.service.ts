import { Injectable, forwardRef, Inject } from '@nestjs/common';

import { FifthService } from './fifth.service';

@Injectable()
export class SixthService {
    constructor(
        @Inject(forwardRef(() => FifthService))
        protected fifth: WrapperType<FifthService>,
    ) {}

    circular() {
        return `SixthService 循环依赖2`;
    }
}
