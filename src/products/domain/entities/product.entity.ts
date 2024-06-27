import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

export class ProductEntity implements Product {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    user_id: string;

    @ApiProperty({ example: 'Cloro' })
    name: string;

    @ApiProperty({ example: 105.00 })
    price: number;
}