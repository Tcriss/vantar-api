import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcrypt';

import { SecurityOptions } from '../decorators';
import { CommonModuleOptions } from '../../domain/interfaces';

@Injectable()
export class BcryptProvider {

    constructor(@SecurityOptions() private readonly options: CommonModuleOptions) {}

    public async compare(value: string, hashedValue: string): Promise<boolean> {
        return compare(value, hashedValue);
    }

    public async hash(value: string): Promise<string> {
        const salt: string = await this.generateSalt();

        // deepcode ignore WrongNumberOfArguments: hash function from bcrypt accepts to args, one is the value ti be hash, the other is the saltRounds
        return hash(value, salt);
    }

    private async generateSalt(): Promise<string> {
        return genSalt(+this.options.saltRounds);
    }
}