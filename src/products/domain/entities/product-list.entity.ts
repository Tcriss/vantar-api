import { ApiProperty } from "@nestjs/swagger";

export class ProductList {
    @ApiProperty({ format: 'object-id' })
    id?: string;

    @ApiProperty({ example: 'Cloro' })
    name?: string;

    @ApiProperty({ example: 80.00 })
    unit_price: string;

    @ApiProperty({ example: 3 })
    amount: number

    @ApiProperty({ example: 240.00 })
    total: number;
}