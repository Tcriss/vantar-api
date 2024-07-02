import { Collection, Db, InsertManyResult, WithId } from "mongodb";

import { MongoProvider } from "../../../../database/infrastructure/providers/mongo-db/mongo.provider";
import { BaseRepository } from "../../../../common/domain/interfaces/base-repository.interface";
import { ProductList } from "../../../domain/entities/product-list.entity";

export class ProductListRepository implements Partial<BaseRepository<ProductList>>{

    private db: Db;
    private collection: Collection<ProductList>;

    constructor(private mongo: MongoProvider, collectionName: string) {
        this.db = this.mongo.db();
        this.collection = this.db.collection(collectionName, { ignoreUndefined: true });
    }

    public async findAll(): Promise<WithId<ProductList>[]> {
        return this.collection.find().toArray();
    }

    public async create(list: ProductList[]): Promise<InsertManyResult<ProductList>> {
        return this.collection.insertMany(list);
    }
}