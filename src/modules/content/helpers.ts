import { ConfigureFactory, ConfigureRegister } from '@/modules/config/types';
import { ContentConfig } from '@/modules/content/types';

export const defaultContentConfig: ContentConfig = { searchType: 'against', htmlEnabled: false };

export const createContentConfig: (
    register: ConfigureRegister<RePartial<ContentConfig>>,
) => ConfigureFactory<ContentConfig> = (register) => ({
    register,
    defaultRegister: () => defaultContentConfig,
});
