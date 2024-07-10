import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Collection, MongoClient, ServerApiVersion } from 'mongodb';

import { DatabaseOptions } from '../../../domain/interfaces';
import { Options } from '../../../application/decorators/options.decorator';

@Injectable()
export class MongoProvider extends MongoClient implements OnModuleInit, OnModuleDestroy {

    constructor(@Options() private readonly config: DatabaseOptions) {
        super(config.mongoUri, {
            serverApi: {
                version: ServerApiVersion.v1,
                deprecationErrors: true,
                strict: true,
            }
        });
    }

    public onModuleInit(): void {
        this.connect();
    }

    public onModuleDestroy(): void {
        this.close();
    }

    public database(): Collection {
        return this.db(this.config.databaseName).collection(this.config.collectionName);
    }
}