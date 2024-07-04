import { Inject } from "@nestjs/common";

export const InventoryRepositoryToken = Symbol();
export const InventoryRepository = () => Inject(InventoryRepositoryToken);