import { ReqUser } from "../types";

export interface BaseController<T> {
    findAll: (...atr) => Promise<Partial<T>[]>,
    findOne: (...atr) => Promise<Partial<T>>,
    createMany?: (...atr) => Promise<unknown>,
    create: (...atr) => Promise<unknown>,
    update: (id: string, req: ReqUser, ...atr) => Promise<unknown>,
    delete: (id: string, req: ReqUser) => Promise<unknown>
}