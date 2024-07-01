import { ApiProperty } from "@nestjs/swagger";
import { Invoice } from "@prisma/client";

import { ProductEntity } from "../../../products/domain/entities/product.entity";

export class InvoiceEntity implements Invoice {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    user_id: string;

    @ApiProperty({ example: 400.00 })
    total: number;

    @ApiProperty({ format: 'date' })
    date: Date;

    @ApiProperty({ type: ProductEntity, isArray: true, required: false })
    products?: ProductEntity[]
}