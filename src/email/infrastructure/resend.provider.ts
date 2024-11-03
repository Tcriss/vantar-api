import { Injectable } from '@nestjs/common';

import { ResendProviderEntity } from '@email/domain/entities';
import { EmailModuleOptions } from '@email/domain/interfaces';
import { EmailOptions } from '@email/application/decorators';

@Injectable()
export class ResendProvider extends ResendProviderEntity {
    constructor(@EmailOptions() public readonly options: EmailModuleOptions) {
        super(options.apiKey)
    }
}