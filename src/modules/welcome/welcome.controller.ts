import { Controller, Get } from '@nestjs/common';

/**
 * 欢迎访问 Ink NestJS API
 */
@Controller()
export class WelcomeController {
    @Get()
    getMessage(): string {
        return '欢迎访问 Ink NestJS API';
    }
}
