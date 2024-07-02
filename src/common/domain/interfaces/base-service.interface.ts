export interface BaseService<T> {
    findAll: (...atr) => Promise<Partial<T>[]>,
    findOne: (...atr) => Promise<Partial<T>>,
    createMany: (...atr) => Promise<unknown>,
    create: (...atr) => Promise<T>,
    update: (id: string, userId: string, ...atr) => Promise<T>,
    delete: (id: string, userId: string) => Promise<T>
}