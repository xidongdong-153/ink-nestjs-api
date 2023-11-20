import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from '@/app.module';

const bootstrap = async () => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        cors: true,
        logger: ['error', 'warn'],
    });

    app.setGlobalPrefix('api');

    await app.listen(2333, () => {
        console.log('api: http://localhost:2333/api');
    });
};

bootstrap();
