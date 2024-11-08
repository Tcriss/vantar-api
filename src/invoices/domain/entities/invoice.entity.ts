import { ApiProperty } from "@nestjs/swagger";
import { Invoice } from "@prisma/client";

import { ProductEntityList } from "@products/domain/entities";

export class InvoiceEntity implements Invoice {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'date' })
    created_at: Date;

    @ApiProperty({ format: 'uuid' })
    shop_id: string;

    @ApiProperty({ example: 400.00 })
    total: number;

    @ApiProperty({ format: 'date' })
    date: Date;

    @ApiProperty({ type: ProductEntityList, isArray: true })
    products?: Partial<ProductEntityList>[]
}