import { Injectable } from '@nestjs/common';

import { ShopEntity } from '../../../shops/domain/entities';
import { SelectedFields } from '../../../shops/domain/types';
import { Repository } from '../../../common/domain/entities';
import { Pagination } from '../../../common/domain/types';
import { PrismaProvider } from '../../../database/infrastructure/providers/prisma/prisma.provider';

@Injectable()
export class ShopRepository implements Partial<Repository<ShopEntity>> {

    constructor(private readonly prisma: PrismaProvider) {}

    public async findAll(pagination: Pagination, fields?: SelectedFields): Promise<Partial<ShopEntity>[]> {
        const { take, skip } = pagination;

        return this.prisma.shop.findMany({
            orderBy: { created_at: 'asc' },
            include: fields,
            take,
            skip
        });
    }

    public async findOne(id: string, fields?: SelectedFields): Promise<Partial<ShopEntity>> {
        return this.prisma.shop.findUnique({
            where: { id: id },
            include: fields,
        });
    }

    public async create(shop: Partial<ShopEntity>): Promise<ShopEntity> {
        return this.prisma.shop.create({
            data: {
                name: shop.name,
                user_id: shop.user_id
            }
        });
    }

    public async update(id: string, shop: Partial<ShopEntity>): Promise<ShopEntity> {
        return this.prisma.shop.update({
            where: { id: id },
            data: shop
        });
    }

    public async delete(id: string): Promise<ShopEntity> {
        return this.prisma.shop.delete({
            where: { id: id }
        });
    }
}
