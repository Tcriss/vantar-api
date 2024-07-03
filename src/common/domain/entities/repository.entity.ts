import { DeleteResult, InsertManyResult, InsertOneResult, UpdateResult } from "mongodb";

import { Pagination } from "../types";

export abstract class Repository<T> {
    abstract findAll(userId: string, page?: Pagination, fields?: unknown, q?: string): Promise<Partial<T>[]>;
    abstract findOne(id: string, fields?: unknown): Promise<Partial<T>>;
    abstract createMany(entities: Partial<T>[]): Promise<unknown>;
    abstract create(entity: Partial<T>): Promise<T>;
    abstract insertMany(docs: T[]): Promise<InsertManyResult<T>>;
    abstract insert(doc: T): Promise<InsertOneResult<T>>;
    abstract update(id: string, entity: Partial<T>): Promise<T>;
    abstract updateDoc(id: string, doc: T): Promise<UpdateResult<T>>;
    abstract delete(id: string): Promise<T>;
    abstract deleteDoc(id: string): Promise<DeleteResult>;
};