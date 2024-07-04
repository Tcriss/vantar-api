import { Inject } from "@nestjs/common";

export const UserRepositoryToken = Symbol();
export const UserRepository = () => Inject(UserRepositoryToken);