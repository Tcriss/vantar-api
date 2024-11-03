import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Collection, MongoClient, ServerApiVersion } from 'mongodb';

import { DatabaseOptions } from '@database/domain/interfaces';
import { Options } from '@database/application/decorators';

@Injectable()
export class MongoProvider<T> extends MongoClient implements OnModuleInit, OnModuleDestroy {

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

    public database(): Collection<T> {
        return this.db(this.config.databaseName).collection<T>(this.config.collectionName);
    }
}