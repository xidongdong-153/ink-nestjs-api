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
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from '@/modules/content/dtos';
import { CategoryService } from '@/modules/content/services';
import { AppIntercepter } from '@/modules/core/providers';

@UseInterceptors(AppIntercepter)
@Controller('categories')
export class CategoryController {
    constructor(protected service: CategoryService) {}

    @Get('tree')
    @SerializeOptions({ groups: ['category-tree'] })
    async tree() {
        return this.service.findTress();
    }

    @Get()
    @SerializeOptions({ groups: ['category-list'] })
    async list(
        @Query(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
            }),
        )
        options: QueryCategoryDto,
    ) {
        return this.service.paginate(options);
    }

    @Get(':id')
    @SerializeOptions({ groups: ['category-detail'] })
    async detail(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.detail(id);
    }

    @Post()
    @SerializeOptions({ groups: ['category-detail'] })
    async create(
        @Body(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['create'],
            }),
        )
        data: CreateCategoryDto,
    ) {
        return this.service.create(data);
    }

    @Patch()
    @SerializeOptions({ groups: ['category-detail'] })
    async update(
        @Body(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                forbidUnknownValues: true,
                validationError: { target: false },
                groups: ['update'],
            }),
        )
        data: UpdateCategoryDto,
    ) {
        return this.service.update(data);
    }

    @Delete(':id')
    @SerializeOptions({ groups: ['category-detail'] })
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.delete(id);
    }
}
