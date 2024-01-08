import { createConnectionOptions } from '@/modules/config/helpers';
import { ConfigureFactory, ConfigureRegister } from '@/modules/config/types';
import { MelliConfig } from '@/modules/meilisearch/types';

export const createMeilliConfig: (
    register: ConfigureRegister<RePartial<MelliConfig>>,
) => ConfigureFactory<MelliConfig, MelliConfig> = (register) => ({
    register,
    hook: (configure, value) => createConnectionOptions(value),
});
