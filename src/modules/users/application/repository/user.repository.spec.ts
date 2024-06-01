import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";

import { PrismaProvider } from "../../../prisma/providers/prisma.provider";
import { UserRepository } from "./user.repository";
import { prismaMock } from "../../domain/mocks/user-providers.mock";
import { usersMock } from "../../domain/mocks/user.mocks";

describe('User Repository', () => {
    let repository: UserRepository;
    let prisma: PrismaProvider;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ 
                UserRepository, 
                { provide: PrismaProvider, useValue: prismaMock } 
            ],
        }).compile();

        repository = module.get<UserRepository>(UserRepository);
        prisma = module.get<PrismaProvider>(PrismaProvider);
    });

    it('shoul be define', async () => {
        expect(repository).toBeDefined();
    });

    describe('Find User', () => {
        it('should find user by id', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(usersMock[0]);

            const res: User = await repository.find(usersMock[0].id);

            expect(res).toEqual(usersMock[0]);
        });

        it('should be undefined if user was not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(usersMock[0]);

            const res: User = await repository.find(randomUUID());

            expect(res).toBeUndefined;
        });
    });

    describe('Create User', () => {
        it('should create a user', async () => {
            jest.spyOn(prisma.user, 'create').mockResolvedValue(usersMock[1]);

            const res: User = await repository.create(usersMock[1]);

            expect(res).toEqual(usersMock[1]);
        });
    });

    describe('Update User', () => {
        const {name, password} = usersMock[1];

        it('should update a user if some fields are missing', async () => {
            jest.spyOn(prisma.user, 'update').mockResolvedValue(usersMock[3]);

            const res: User = await repository.update(usersMock[2].id, { name, password });

            expect(res).toEqual(usersMock[3]);
        });

        it('should be undefined if user was not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);

            const res: User = await repository.update(randomUUID(), { name, password });

            expect(res).toBeUndefined;
        });
    });

    describe('Delete User', () => {
        it('should delte a user', async () => {
            jest.spyOn(prisma.user, 'delete').mockResolvedValue(usersMock[0]);

            const res: User = await repository.delete(usersMock[0].id);

            expect(res).toEqual(usersMock[0]);
        });

        it('should be undefined if user was not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);

            const res: User = await repository.find(randomUUID());

            expect(res).toBeUndefined;
        });
    });
});