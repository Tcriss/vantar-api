import { Pagination } from "src/common/domain/types";
import { SelectedFields } from "../types/selected-fields.type";
import { UserEntity } from "../entities/user.entity";

export const UserRepositoryToken = Symbol("UserRepositoryI");
export interface UserRepositoryI {
    findAllUsers: (page: Pagination, fields?: SelectedFields, query?: string) => Promise<Partial<UserEntity>[]>;
    findOneUser: (params: { id?: string, email?: string }) => Promise<UserEntity>;
    createUser: (user: Partial<UserEntity>) => Promise<UserEntity>;
    updateUser: (id: string, user: Partial<UserEntity>) => Promise<UserEntity>;
    deleteUser: (id: string) => Promise<UserEntity>;
};