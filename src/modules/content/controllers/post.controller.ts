import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    SerializeOptions,
} from '@nestjs/common';

import { CreatePostDto, QueryPostDto, UpdatePostDto } from '@/modules/content/dtos';
import { PostService } from '@/modules/content/services';

/**
 * 文章控制器
 * 负责处理与文章相关的请求，如获取文章列表、创建新文章等。
 */

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @Get()
    @SerializeOptions({ groups: ['post-list'] })
    async list(
        @Query()
        options: QueryPostDto,
    ) {
        return this.postService.paginate(options);
    }

    @Get(':id')
    @SerializeOptions({ groups: ['post-detail'] })
    async detail(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.postService.detail(id);
    }

    @Post()
    @SerializeOptions({ groups: ['post-detail'] })
    async store(
        @Body()
        data: CreatePostDto,
    ) {
        return this.postService.create(data);
    }

    @Patch()
    @SerializeOptions({ groups: ['post-detail'] })
    async update(
        @Body()
        data: UpdatePostDto,
    ) {
        return this.postService.update(data);
    }

    @Delete(':id')
    @SerializeOptions({ groups: ['post-detail'] })
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.postService.delete(id);
    }
}
