import { Injectable } from '@nestjs/common';

import { ResendProviderEntity } from '../domain/entities/resend-provider.entiry';
import { EmailModuleOptions } from '../domain/interfaces';
import { EmailOptions } from '../application/decorators/email-options.decorator';

@Injectable()
export class ResendProvider extends ResendProviderEntity {
    constructor(@EmailOptions() public readonly options: EmailModuleOptions) {
        super(options.apiKey)
    }
}