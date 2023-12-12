import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { useContainer } from 'class-validator';

import { AppModule } from '@/app.module';

const bootstrap = async () => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        cors: true,
        logger: ['error', 'warn'],
    });

    app.setGlobalPrefix('api');

    // 使validator的约束可以使用nestjs的容器
    useContainer(app.select(AppModule), {
        fallbackOnErrors: true,
    });

    await app.listen(2333, () => {
        console.log('api: http://localhost:2333/api');
    });
};

bootstrap();
