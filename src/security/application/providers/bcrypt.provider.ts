import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';

import { SecurityOptions } from '../decorators';
import { SecurityModuleOptions } from '../../doamin';

@Injectable()
export class BcryptProvider {

    constructor(@SecurityOptions() private options: SecurityModuleOptions) {}

    public async compare(value: string, hashedValue: string): Promise<boolean> {
        return compare(value, hashedValue);
    }

    public async hash(value: string): Promise<string> {
        const salt: string = await this.generateSalt();

        return hash(value, salt);
    }

    private async generateSalt(): Promise<string> {
        return genSalt(+this.options.saltRounds);
    }
}