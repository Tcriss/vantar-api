import { Collection, DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { Injectable } from "@nestjs/common";

import { Repository } from "../../../../common/domain/entities";
import { MongoService } from "../../../../database/infrastructure/services/mongo.service";
import { InvoiceProductList } from "../../../../invoices/domain/types";

@Injectable()
export class ProductListRepository implements Partial<Repository<InvoiceProductList>> {

    collection: Collection<InvoiceProductList>;

    constructor(private mongo: MongoService<InvoiceProductList>) {}

    public setCollection(collection: string): void {
        this.collection = this.mongo.getProductList(collection);
    }
 
    public async findOne(id: string): Promise<InvoiceProductList | null> {
        return this.collection.findOne<InvoiceProductList>({ id: id });
    }

    public async insert(doc: InvoiceProductList): Promise<InsertOneResult<InvoiceProductList>> {
        return this.collection.insertOne(doc);
    }

    public async updateDoc(id: string, doc: InvoiceProductList): Promise<UpdateResult<InvoiceProductList>> {
        return this.collection.updateOne({ id: id }, {
            $set: { products: doc.products }
        });
    }

    public async deleteDoc(id: string): Promise<DeleteResult> {
        return this.collection.deleteOne({ id: id });
    }
}