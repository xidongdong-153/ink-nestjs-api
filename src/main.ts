import { WEBAPP, createData } from '@/constants';
import { createApp, startApp } from '@/modules/core/helpers';
import { echoApi } from '@/modules/restful/helpers';

startApp(createApp(WEBAPP, createData), ({ configure, container }) => async () => {
    console.log();
    console.log();
    echoApi(configure, container);
});
