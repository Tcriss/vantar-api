import { ApiProperty } from "@nestjs/swagger";
import { Inventory } from "@prisma/client";

import { ProductList } from "../../../products/domain/entities/product-list.entity";

export class InventoryEntity implements Inventory {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    user_id: string;
    
    @ApiProperty()
    cost: number;

    @ApiProperty()
    total: number;

    @ApiProperty()
    subtotal: number;

    @ApiProperty()
    created_at: Date;

    @ApiProperty({ type: ProductList, isArray: true })
    products?: Partial<ProductList>[];
}