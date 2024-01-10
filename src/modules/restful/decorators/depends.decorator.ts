import { SetMetadata, Type } from '@nestjs/common';

import { CONTROLLER_DEPENDS } from '@/modules/restful/constants';

export const Depends = (...depends: Type<any>[]) => SetMetadata(CONTROLLER_DEPENDS, depends ?? []);
