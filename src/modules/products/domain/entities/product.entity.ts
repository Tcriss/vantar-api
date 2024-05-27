import { ApiProperty } from "@nestjs/swagger";


export class Product {
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
    category: unknown;

    @ApiProperty()
    expiration: string;
}