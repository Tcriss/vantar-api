import { InsertManyResult } from "mongodb";

import { Pagination } from "../types";

export abstract class Repository<T> {
    abstract findAll(userId: string, page?: Pagination, fields?: unknown, q?: string): Promise<Partial<T>[]>;
    abstract findOne(id: string, fields?: unknown): Promise<Partial<T>>;
    abstract createMany(entities: Partial<T>[]): Promise<unknown>;
    abstract create(entity: Partial<T>): Promise<T>;
    abstract insert(docs: T[]): Promise<InsertManyResult<T>>;
    abstract update(id: string, entity: Partial<T>): Promise<T>;
    abstract delete(id: string): Promise<T>;
};