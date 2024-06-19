import { Test, TestingModule } from "@nestjs/testing";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";

import { PrismaProvider } from "../../../prisma/infrastructure/providers/prisma.provider";
import { UserRepository } from "./user.repository";
import { prismaMock } from "../../domain/mocks/user-providers.mock";
import { partialUserMock1, userMock, userMock1, userMock2 } from "../../domain/mocks/user.mocks";
import { UserEntity } from "src/users/domain/entities/user.entity";
import { SelectedFields } from "../../domain/types";

describe('User Repository', () => {
    let repository: UserRepository;
    let prisma: PrismaProvider;

    beforeAll(async () => {
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

    describe('Find All Users', () => {
        it('should fetch users', async () => {
            jest.spyOn(prisma.user, 'findMany').mockResolvedValue([ userMock, userMock1, userMock2 ]);

            const res: Partial<UserEntity>[] = await repository.findAllUsers({ take: 10, skip: 0 });

            expect(res).toEqual([ userMock, userMock1, userMock2 ]);
        });

        it('should fecth what is in pagination', async () => {
            jest.spyOn(prisma.user, 'findMany').mockResolvedValue([ userMock1 ]);
    
            const res: Partial<UserEntity>[] = await repository.findAllUsers({ take: 1, skip: 1 });
    
            expect(res).toEqual([ userMock1 ]);
        });

        it('shuld fetch some fields', async () => {
            jest.spyOn(prisma.user, 'findMany').mockResolvedValue([ userMock, userMock1 ]);
    
            const q: string = 'al'
            const res: Partial<UserEntity>[] = await repository.findAllUsers({ take: 1, skip: 1 }, null, q);
    
            expect(res).toEqual([ userMock, userMock1 ]);
            expect(res[0].name.toLowerCase()).toContain(q);
        });
    });

    describe('Find One User', () => {
        it('should find user by id', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userMock);

            const { id, email } = userMock;
            const res: User = await repository.findOneUser({ id, email });

            expect(res).toEqual(userMock);
        });

        it('should be undefined if user was not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userMock);

            const { email } = userMock;
            const id: string = randomUUID()
            const res: User = await repository.findOneUser({ id, email });

            expect(res).toBeUndefined;
        });
    });

    describe('Create User', () => {
        it('should create a user', async () => {
            jest.spyOn(prisma.user, 'create').mockResolvedValue(userMock);

            const res: User = await repository.createUser(userMock);

            expect(res).toEqual(userMock);
        });
    });

    describe('Update User', () => {
        const {name, password} = userMock1;

        it('should update a user if some fields are missing', async () => {
            jest.spyOn(prisma.user, 'update').mockResolvedValue(userMock);

            const res: User = await repository.updateUser(userMock1.id, { name, password });

            expect(res).toEqual(userMock);
        });

        it('should be undefined if user was not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);

            const res: User = await repository.updateUser(randomUUID(), { name, password });

            expect(res).toBeUndefined;
        });
    });

    describe('Delete User', () => {
        it('should delte a user', async () => {
            jest.spyOn(prisma.user, 'delete').mockResolvedValue(userMock);

            const res: User = await repository.deleteUser(userMock.id);

            expect(res).toEqual(userMock);
        });

        it('should be undefined if user was not found', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(undefined);

            const res: User = await repository.deleteUser(randomUUID());

            expect(res).toBeUndefined;
        });
    });
});