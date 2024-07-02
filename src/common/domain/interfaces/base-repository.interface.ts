export interface BaseRepository<T> {
    findAll: (...atr) => Promise<Partial<T>[]>,
    findOne: (...atr) => Promise<Partial<T>>,
    createMany?: (...atr) => Promise<any>,
    create: (...atr) => Promise<unknown>,
    update: (id: string, data: Partial<T>) => Promise<T>,
    delete: (id: string) => Promise<T>
}