import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';

import { MongoProvider } from '../providers/mongo-db/mongo.provider';

@Injectable()
export class MongoService<T> {

    constructor(private mongo: MongoProvider, private config: ConfigService) {}

    public getProductList(collection: string): Collection<T> {
        return this.mongo.db(this.config.get('MONGO_DB_NAME')).collection(collection);
    }
}