import { Collection, InsertManyResult, WithId } from "mongodb";
import { Injectable } from "@nestjs/common";

import { ProductList } from "../../../../products/domain/entities/product-list.entity";
import { Repository } from "../../../../common/domain/entities";
import { MongoService } from "../../../../database/infrastructure/services/mongo.service";

@Injectable()
export class ProductListRepository implements Partial<Repository<ProductList>> {

    collection: Collection<ProductList>;

    constructor(private mongo: MongoService) {
        this.collection = this.mongo.getProductList('product-history');
    }

    public async findAll(): Promise<WithId<ProductList>[]> {
        return this.collection.find().toArray();
    }

    public async insert(docs: ProductList[]): Promise<InsertManyResult<ProductList>> {
        return this.collection.insertMany(docs);
    }
}