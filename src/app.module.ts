import { Module } from '@nestjs/common';

import { ContentModule } from '@/modules/content/content.module';
import { WelcomeModule } from '@/modules/welcome/welcome.module';

import { CoreModule } from './modules/core/core.module';

@Module({
    imports: [
        ContentModule,
        WelcomeModule,
        CoreModule.forRoot({
            config: {
                name: '欢迎访问 Ink NestJS API !',
            },
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
