import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoProvider extends MongoClient implements OnModuleInit, OnModuleDestroy {

    constructor(private config: ConfigService) {
        super(config.get<string>('MONGO_URI'), {
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
}