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

import { CreateTagDto, QueryTagsDto, UpdateTagDto } from '@/modules/content/dtos';
import { TagService } from '@/modules/content/services';
import { DeleteDto, DeleteWithTrashDto } from '@/modules/restful/dtos';

@Controller('tags')
export class TagController {
    constructor(protected service: TagService) {}

    @Get()
    @SerializeOptions({})
    async list(
        @Query()
        options: QueryTagsDto,
    ) {
        return this.service.paginate(options);
    }

    @Get(':id')
    @SerializeOptions({})
    async detail(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.service.detail(id);
    }

    @Post()
    @SerializeOptions({})
    async store(
        @Body()
        data: CreateTagDto,
    ) {
        return this.service.create(data);
    }

    @Patch()
    @SerializeOptions({})
    async update(
        @Body()
        data: UpdateTagDto,
    ) {
        return this.service.update(data);
    }

    @Delete()
    @SerializeOptions({ groups: ['post-list'] })
    async delete(@Body() data: DeleteWithTrashDto) {
        const { ids, trash } = data;

        return this.service.delete(ids, trash);
    }

    @Patch('restore')
    @SerializeOptions({ groups: ['post-list'] })
    async restore(@Body() data: DeleteDto) {
        const { ids } = data;

        return this.service.restore(ids);
    }
}
