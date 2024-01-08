import { BadGatewayException, ModuleMetadata, Type } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { isNil } from 'lodash';

import { ConfigModule } from '@/modules/config/config.module';
import { Configure } from '@/modules/config/configure';

import { ConfigureFactory, ConfigureRegister } from '@/modules/config/types';

import { getDefaultAppConfig } from '@/modules/core/constants';
import { CoreModule } from '@/modules/core/core.module';

import { CreateModule } from '@/modules/core/helpers';
import { AppFilter, AppIntercepter, AppPipe } from '@/modules/core/providers';

import { App, AppConfig, CreateOptions } from '@/modules/core/types';

/**
 * 应用列表
 */
export const apps: Record<string, App> = {};

/**
 * 创建一个应用
 * @param name 应用名称
 * @param options 创建选项
 */
export const createApp = (name: string, options: CreateOptions) => async (): Promise<App> => {
    const { config, builder } = options;
    // 设置app的配置中心实例
    apps[name] = { configure: new Configure() };
    // 初始化配置实例
    await apps[name].configure.initilize(config.factories, config.storage);
    // 如果没有app配置则使用默认配置
    if (!apps[name].configure.has('app')) {
        throw new BadGatewayException('App config not exists!');
    }
    // 创建启动模块
    const BootModule = await createBootModule(apps[name].configure, options);
    // 创建app的容器实例
    apps[name].container = await builder({
        configure: apps[name].configure,
        BootModule,
    });
    // 设置api前缀
    if (apps[name].configure.has('app.prefix')) {
        apps[name].container.setGlobalPrefix(await apps[name].configure.get<string>('app.prefix'));
    }
    // 为class-validator添加容器以便在自定义约束中可以注入dataSource等依赖
    useContainer(apps[name].container.select(BootModule), {
        fallbackOnErrors: true,
    });

    return apps[name];
};

/**
 * 构建一个启动模块
 * @param params
 * @param options
 */
export async function createBootModule(
    configure: Configure,
    options: Pick<CreateOptions, 'globals' | 'imports'>,
): Promise<Type<any>> {
    const { globals = {}, imports: moduleCreator } = options;
    // 获取需要导入的模块
    const modules = await moduleCreator(configure);
    const imports: ModuleMetadata['imports'] = [
        ...modules,
        CoreModule.forRoot(),
        ConfigModule.forRoot(configure),
    ];
    // 配置全局提供者
    const providers: ModuleMetadata['providers'] = [];
    if (globals.pipe !== null) {
        const pipe = globals.pipe
            ? globals.pipe(configure)
            : new AppPipe({
                  transform: true,
                  whitelist: true,
                  forbidNonWhitelisted: true,
                  forbidUnknownValues: true,
                  validationError: { target: false },
              });
        providers.push({
            provide: APP_PIPE,
            useValue: pipe,
        });
    }
    if (globals.interceptor !== null) {
        providers.push({
            provide: APP_INTERCEPTOR,
            useClass: globals.interceptor ?? AppIntercepter,
        });
    }
    if (globals.filter !== null) {
        providers.push({
            provide: APP_FILTER,
            useClass: AppFilter,
        });
    }

    return CreateModule('BootModule', () => {
        const meta: ModuleMetadata = {
            imports,
            providers,
        };
        return meta;
    });
}

/**
 * 应用配置工厂
 */
export const createAppConfig: (
    register: ConfigureRegister<RePartial<AppConfig>>,
) => ConfigureFactory<AppConfig> = (register) => ({
    register,
    defaultRegister: (configure) => getDefaultAppConfig(configure),
    hook: (configure: Configure, value) => {
        if (isNil(value.url))
            value.url = `${value.https ? 'https' : 'http'}://${value.host}:${value.port}`;
        return value;
    },
});

/**
 * 构建APP CLI,默认start命令应用启动监听app
 * @param creator APP构建器
 * @param listened 监听回调
 */
export async function startApp(
    creator: () => Promise<App>,
    listened?: (app: App) => () => Promise<void>,
) {
    const app = await creator();
    const { container, configure } = app;
    const { port, host } = await configure.get<AppConfig>('app');
    await container.listen(port, host, listened(app));
}
