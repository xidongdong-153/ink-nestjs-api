import { Module } from '@nestjs/common';

import { WelcomeController } from '@/modules/welcome/welcome.controller';

@Module({
    imports: [],
    controllers: [WelcomeController],
    providers: [],
})
export class AppModule {}
