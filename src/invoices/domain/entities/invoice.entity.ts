import { ApiProperty } from "@nestjs/swagger";
import { Invoice } from "@prisma/client";

import { ProductEntityList } from "../../../products/domain/entities/product-list.entity";

export class InvoiceEntity implements Invoice {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    user_id: string;

    @ApiProperty({ example: 400.00 })
    total: number;

    @ApiProperty({ format: 'date' })
    date: Date;

    @ApiProperty({ type: ProductEntityList, isArray: true })
    products?: Partial<ProductEntityList>[]
}