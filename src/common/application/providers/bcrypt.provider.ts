import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider {

    constructor(private config: ConfigService) {}

    public async compare(value: string, hashedValue: string): Promise<boolean> {
        return bcrypt.compare(value, hashedValue);
    }

    public async hash(value: string): Promise<string> {
        const salt: string = await this.generateSalt();

        return bcrypt.hash(value, salt);
    }

    private async generateSalt(): Promise<string> {
        return bcrypt.genSalt(+this.config.get<number>('HASH'));
    }
}