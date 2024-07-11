import { ApiProperty } from "@nestjs/swagger";

export class ProductEntityList {
    id?: string;

    @ApiProperty({ example: 'Cloro' })
    name?: string;

    @ApiProperty({ example: 80.00 })
    unit_price: number;

    @ApiProperty({ example: 3 })
    amount: number

    @ApiProperty({ example: 240.00 })
    total: number;
}