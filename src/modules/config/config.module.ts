import { DynamicModule, Module } from '@nestjs/common';

import { Configure } from '@/modules/config/configure';

@Module({})
export class ConfigModule {
    static forRoot(configure: Configure): DynamicModule {
        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: Configure,
                    useValue: configure,
                },
            ],
            exports: [Configure],
        };
    }
}
