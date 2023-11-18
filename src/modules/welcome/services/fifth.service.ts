import { Injectable, forwardRef, Inject } from '@nestjs/common';

import { SixthService } from './sixth.service';

@Injectable()
export class FifthService {
    constructor(
        @Inject(forwardRef(() => SixthService))
        protected sixth: WrapperType<SixthService>,
    ) {}

    circular() {
        return `FifthService 循环依赖1${this.sixth.circular()}`;
    }
}
