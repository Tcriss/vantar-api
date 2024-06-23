import { Inject } from "@nestjs/common";

import { InventoryRepositoryToken } from "../../domain/interfaces/inventory-repository.interface";

export const Repository = () => Inject(InventoryRepositoryToken);