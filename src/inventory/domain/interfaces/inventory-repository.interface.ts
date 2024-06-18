import { Pagination } from "src/common/domain/types";
import { SelectedFields } from "../types";
import { InventoryEntity } from "../entities/inventory.entity";

export const InventoryRepositoryToken = Symbol('InventoryRepositoryI');
export interface InventoryRepositoryI {
    findAllInventories: (customerId: string, page: Pagination, fields?: SelectedFields, query?: string) => Promise<Partial<InventoryEntity>[]>;
    findOneInventory: (id: string, fields?: SelectedFields) => Promise<Partial<InventoryEntity>>;
    createInventory: (newInventory: Partial<InventoryEntity>) => Promise<InventoryEntity>;
    updateInventory: (id: string, inventory: Partial<InventoryEntity>) => Promise<InventoryEntity>;
    deleteInventory: (id: string) => Promise<InventoryEntity>;
}