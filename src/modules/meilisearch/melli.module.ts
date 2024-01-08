import { Module } from '@nestjs/common';

import { Configure } from '@/modules/config/configure';
import { panic } from '@/modules/core/helpers';
import { MeilliService } from '@/modules/meilisearch/meilli.service';

@Module({})
export class MeilliModule {
    static async forRoot(configure: Configure) {
        if (!configure.has('meilli')) {
            panic({ message: 'Database config not exists or not right!' });
        }
        return {
            global: true,
            module: MeilliModule,
            providers: [
                {
                    provide: MeilliService,
                    useFactory: async () => {
                        const service = new MeilliService(await configure.get('meilli'));
                        service.createClients();
                        return service;
                    },
                },
            ],
            exports: [MeilliService],
        };
    }
}
