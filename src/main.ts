import { isNil } from 'lodash';

import { WEBAPP, createData } from '@/constants';
import { createApp, startApp } from '@/modules/core/helpers';

startApp(createApp(WEBAPP, createData), ({ configure }) => async () => {
    console.log();
    const chalk = (await import('chalk')).default;
    const appUrl = await configure.get<string>('app.url');
    // 设置应用的API前缀,如果没有则与appUrl相同
    const urlPrefix = await configure.get('app.prefix', undefined);
    const apiUrl = !isNil(urlPrefix)
        ? `${appUrl}${urlPrefix.length > 0 ? `/${urlPrefix}` : urlPrefix}`
        : appUrl;
    console.log(`- AppUrl: ${chalk.green.underline(appUrl)}`);
    console.log();
    console.log(`- ApiUrl: ${chalk.green.underline(apiUrl)}`);
});
