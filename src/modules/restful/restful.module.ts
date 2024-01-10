import { Module } from '@nestjs/common';

import { Configure } from '@/modules/config/configure';
import { Restful } from '@/modules/restful/restful';

@Module({})
export class RestfulModule {
    static async forRoot(configure: Configure) {
        const restful = new Restful(configure);
        await restful.create(await configure.get('api'));
        return {
            module: RestfulModule,
            global: true,
            imports: restful.getModuleImports(),
            providers: [
                {
                    provide: Restful,
                    useValue: restful,
                },
            ],
            exports: [Restful],
        };
    }
}
