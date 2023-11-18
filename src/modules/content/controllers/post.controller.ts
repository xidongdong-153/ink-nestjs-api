import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';

import { CreatePostDto, UpdatePostDto } from '../dtos';
import { PostService } from '../services';

/**
 * 文章控制器
 * 负责处理与文章相关的请求，如获取文章列表、创建新文章等。
 */
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    async index() {
        return this.postService.findAll();
    }

    @Get(':id')
    async show(@Param('id') id: number) {
        return this.postService.findOne(id);
    }

    @Post()
    async store(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['create'],
            }),
        )
        data: CreatePostDto,
    ) {
        return this.postService.create(data);
    }

    @Patch()
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['update'],
            }),
        )
        data: UpdatePostDto,
    ) {
        return this.postService.update(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.postService.delete(id);
    }
}
