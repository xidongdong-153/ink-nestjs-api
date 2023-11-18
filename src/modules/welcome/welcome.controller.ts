import { Controller, Get, Inject } from '@nestjs/common';

import { ConfigService } from '../core/services/config.service';

import { FifthService } from './services/fifth.service';
import { FirstService } from './services/first.service';
import { FourthService } from './services/fourth.service';
import { SecondService } from './services/second.service';

/**
 * 欢迎访问 Ink NestJS API
 */
@Controller()
export class WelcomeController {
    constructor(
        private configService: ConfigService,
        private first: FirstService,
        @Inject('ID-WELCOME') private idExp: FirstService,
        @Inject('FACTORY-WELCOME') private ftExp: FourthService,
        @Inject('ALIAS-WELCOME') private asExp: FirstService,
        @Inject('ASYNC-WELCOME') private acExp: SecondService,
        private fifth: FifthService,
    ) {}

    @Get()
    getMessage(): string {
        return this.configService.get('name');
    }

    @Get('value')
    async useValue() {
        return this.first.useValue();
    }

    @Get('id')
    async useId() {
        return this.idExp.useId();
    }

    @Get('factory')
    async useFactory() {
        return this.ftExp.getContent();
    }

    @Get('alias')
    async useAlias() {
        return this.asExp.useAlias();
    }

    @Get('async')
    async useAsync() {
        return this.acExp.useAsync();
    }

    @Get('circular')
    async useCircular() {
        return this.fifth.circular();
    }
}
