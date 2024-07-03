import { Collection, InsertOneResult } from "mongodb";
import { Injectable } from "@nestjs/common";

import { Repository } from "../../../../common/domain/entities";
import { MongoService } from "../../../../database/infrastructure/services/mongo.service";
import { InvoiceProductList } from "../../../domain/types";

@Injectable()
export class ProductListRepository implements Partial<Repository<InvoiceProductList>> {

    collection: Collection<InvoiceProductList>;

    constructor(private mongo: MongoService<InvoiceProductList>) {
        this.collection = this.mongo.getProductList('product-history');
    }

    // public async findOne(): Promise<WithId<ProductList>> {
    //     return this.collection.findOne();
    // }

    public async insert(doc: InvoiceProductList): Promise<InsertOneResult<InvoiceProductList>> {
        return this.collection.insertOne(doc);
    }
}