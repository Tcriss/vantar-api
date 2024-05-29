import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '@prisma/client';

import { CategoryRepository } from './category.repository';
import { categoryList } from '../../domain/mocks/categories-list.mock';
import { categoryMock } from '../../domain/mocks/category.mock';
import { PrismaModule } from '../../../prisma/prisma.module';

describe('CategoryRepository', () => {
    let repository: CategoryRepository;

    it('shoul be define', async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CategoryRepository],
            imports: [PrismaModule]
        }).compile();

        repository = module.get<CategoryRepository>(CategoryRepository);
    });

    // it('should fetch all categories', async () => {
    //     const categories: Category[] = await repository.readMany();

    //     expect(categories).toEqual(categoryList);
    // });

    // it('should fetch one category', async () => {
    //     const category: Category = await repository.read(null, 'limpieza');

    //     expect(category).toEqual(categoryMock);
    // })
});