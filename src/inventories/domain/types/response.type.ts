import { InventoryEntity } from "../entities/inventory.entity";

export type InventoyResponse = {
    message: string,
    data?: Partial<InventoryEntity>
};