import { ApiProperty } from "@nestjs/swagger";
import { Inventory } from "@prisma/client";

import { ProductEntityList } from "@products/domain/entities/product-list.entity";

export class InventoryEntity implements Inventory {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    shop_id: string;
    
    @ApiProperty()
    cost: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    subtotal: number;

    @ApiProperty({ format: 'date' })
    created_at: Date;

    @ApiProperty({ type: ProductEntityList, isArray: true })
    products?: Partial<ProductEntityList>[];
}