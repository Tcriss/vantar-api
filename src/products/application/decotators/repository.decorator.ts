import { Inject } from "@nestjs/common";

export const ProductRepositoryToken = Symbol();
export const Repository = () => Inject(ProductRepositoryToken);