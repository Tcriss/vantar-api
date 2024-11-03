import { InventoryEntity } from "@inventories/domain/entities";

export type InventoyResponse = {
    message: string,
    data?: Partial<InventoryEntity>
};