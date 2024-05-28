import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

export class ProductEntity implements Product {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string

    @ApiProperty()
    amount: number;

    @ApiProperty()
    price: number;

    @ApiProperty()
    unit_measure: string;

    @ApiProperty()
    category_name: string;

    @ApiProperty()
    expiration: Date;

    @ApiProperty()
    userId: string;
}