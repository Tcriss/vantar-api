import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

@Injectable()
export class MongoProvider extends MongoClient implements OnModuleInit, OnModuleDestroy {

    constructor(private config: ConfigService) {
        super(config.get<string>('MONGO_URI') || '', {
            serverApi: {
                version: ServerApiVersion.v1,
                deprecationErrors: true,
                strict: true,
            }
        });
        super.db(this.config.get<string>('MONGO_DB_NAME') || '');
    }

    onModuleInit(): void {
        this.connect();
    }

    onModuleDestroy(): void {
        this.close();
    }
}