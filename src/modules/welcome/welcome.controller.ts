import { Controller, Get } from '@nestjs/common';

/**
 * 欢迎访问 Ink NestJS API
 */
@Controller()
export class WelcomeController {
    @Get()
    getMessage(): string {
        return '访问 ink nestjs api, 了解更多 请联系邮箱 youzegehq@gmail.com';
    }
}
