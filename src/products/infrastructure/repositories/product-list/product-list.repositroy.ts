import { Collection, DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { Injectable } from "@nestjs/common";

import { Repository } from "../../../../common/domain/entities";
import { InvoiceProductList } from "../../../../invoices/domain/types";
import { MongoProvider } from "../../../../database/infrastructure/providers/mongo-db/mongo.provider";
import { ProductList } from "../../../domain/types/product-list.type";

@Injectable()
export class ProductListRepository implements Partial<Repository<ProductList>> {

    collection: Collection<ProductList>;

    constructor(private mongo: MongoProvider<ProductList>) {
        this.collection = this.mongo.database();
    }
 
    public async findOne(id: string): Promise<InvoiceProductList | null> {
        return this.collection.findOne<ProductList>({ id: id });
    }

    public async insert(doc: InvoiceProductList): Promise<InsertOneResult<ProductList>> {
        return this.collection.insertOne(doc);
    }

    public async updateDoc(id: string, doc: InvoiceProductList): Promise<UpdateResult<ProductList>> {
        return this.collection.updateOne({ id: id }, {
            $set: { products: doc.products }
        });
    }

    public async deleteDoc(id: string): Promise<DeleteResult> {
        return this.collection.deleteOne({ id: id });
    }
}