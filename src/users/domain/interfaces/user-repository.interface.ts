import { Pagination } from "../../../common/domain/types";
import { UserEntity } from "../entities/user.entity";

export const UserRepositoryToken = Symbol("UserRepositoryI");
export interface UserRepositoryI {
    findAllUsers: (page: Pagination, query?: string) => Promise<UserEntity[]>;
    findOneUser: (params: { id?: string, email?: string }) => Promise<UserEntity>;
    createUser: (user: Partial<UserEntity>) => Promise<UserEntity>;
    updateUser: (id: string, user: Partial<UserEntity>) => Promise<UserEntity>;
    deleteUser: (id: string) => Promise<UserEntity>;
};