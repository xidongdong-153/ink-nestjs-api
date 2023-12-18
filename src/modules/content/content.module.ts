import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { SanitizeService } from '@/modules/content/services/sanitize.service';
import { PostSubscriber } from '@/modules/content/subscribers';
import { ContentConfig } from '@/modules/content/types';
import { DatabaseModule } from '@/modules/database/database.module';

import * as controllers from './controllers';
import * as entities from './entities';
import * as repositories from './repositories';
import * as services from './services';
import { PostService } from './services';

@Module({})
export class ContentModule {
    static forRoot(configRegister: () => ContentConfig): DynamicModule {
        const config: Required<ContentConfig> = {
            searchType: 'against',
            ...(configRegister ? configRegister() : {}),
        };

        const providers: ModuleMetadata['providers'] = [
            ...Object.values(services),
            PostSubscriber,
            SanitizeService,
            {
                provide: PostService,
                inject: [
                    repositories.PostRepository,
                    repositories.CategoryRepository,
                    services.CategoryService,
                    repositories.TagRepository,
                    repositories.CommentRepository,
                    { token: services.SearchService, optional: true },
                ],
                useFactory(
                    postRepository: repositories.PostRepository,
                    categoryRepository: repositories.CategoryRepository,
                    categoryService: services.CategoryService,
                    tagRepository: repositories.TagRepository,
                    commentRepository: repositories.CommentRepository,
                    searchService: services.SearchService,
                ) {
                    return new PostService(
                        postRepository,
                        categoryRepository,
                        categoryService,
                        tagRepository,
                        commentRepository,
                        searchService,
                        config.searchType,
                    );
                },
            },
        ];

        if (config.searchType === 'meilli') providers.push(services.SearchService);

        return {
            module: ContentModule,
            imports: [
                TypeOrmModule.forFeature(Object.values(entities)),
                DatabaseModule.forRepository(Object.values(repositories)),
            ],
            controllers: Object.values(controllers),
            providers,
            exports: [
                ...Object.values(services),
                DatabaseModule.forRepository(Object.values(repositories)),
                PostService,
            ],
        };
    }
}
