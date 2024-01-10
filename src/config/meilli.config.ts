import { MelliConfig } from '@/modules/meilisearch/types';

export const meilli = (): MelliConfig => [
    {
        name: 'default',
        host: 'http://localhost:7700',
        apiKey: '12345678910',
    },
];
