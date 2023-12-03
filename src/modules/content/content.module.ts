import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { SanitizeService } from '@/modules/content/services/sanitize.service';
import { PostSubscriber } from '@/modules/content/subscribers';
import { DatabaseModule } from '@/modules/database/database.module';

import * as controllers from './controllers';
import * as entities from './entities';
import * as repositories from './repositories';
import * as services from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature(Object.values(entities)),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
    controllers: Object.values(controllers),
    providers: [...Object.values(services), PostSubscriber, SanitizeService],
    exports: [
        ...Object.values(services),
        DatabaseModule.forRepository(Object.values(repositories)),
    ],
})
export class ContentModule {}
