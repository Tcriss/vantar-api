import { Inject } from "@nestjs/common";

export const ProductListRepositoryToken = Symbol();
export const ProductListRepository = () => Inject(ProductListRepositoryToken);