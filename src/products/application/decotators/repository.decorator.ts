import { Inject } from "@nestjs/common";

import { ProductRepositoryToken } from "../../domain/interfaces/product-repository.interface";

export const Repository = () => Inject(ProductRepositoryToken);