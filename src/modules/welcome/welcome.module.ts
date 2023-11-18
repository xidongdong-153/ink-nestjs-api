import { Module } from '@nestjs/common';

import { FirstService } from './services/first.service';
import { FourthService } from './services/fourth.service';
import { SecondService } from './services/second.service';
import { ThirdService } from './services/third.service';
import { WelcomeController } from './welcome.controller';
import { FifthService } from './services/fifth.service';
import { SixthService } from './services/sixth.service';

const firstObject = {
    useValue: () => 'firstObject useValue 提供者',
    useAlias: () => 'firstObject 别名提供者',
};

const firstInstance = new FirstService();

@Module({
    controllers: [WelcomeController],
    providers: [
        {
            provide: FirstService,
            useValue: firstObject,
        },
        {
            provide: 'ID-WELCOME',
            useValue: firstInstance,
        },
        {
            provide: SecondService,
            useClass: ThirdService,
        },
        {
            provide: 'FACTORY-WELCOME',
            useFactory(second: SecondService) {
                const factory = new FourthService(second);

                return factory;
            },
            inject: [SecondService],
        },
        {
            provide: 'ALIAS-WELCOME',
            useExisting: FirstService,
        },
        {
            provide: 'ASYNC-WELCOME',
            useFactory: async () => {
                const factory = new FourthService(new SecondService());

                return factory.getPromise();
            },
        },
        FifthService,
        SixthService,
    ],
})
export class WelcomeModule {}
