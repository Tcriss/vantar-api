import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection } from 'mongodb';

import { MongoProvider } from '../providers/mongo-db/mongo.provider';
import { ProductList } from '../../../products/domain/entities/product-list.entity';

@Injectable()
export class MongoService {

    constructor(private mongo: MongoProvider, private config: ConfigService) {}

    public getProductList(collection: string): Collection<ProductList> {
        return this.mongo.db(this.config.get('MONGO_DB_NAME')).collection(collection);
    }
}