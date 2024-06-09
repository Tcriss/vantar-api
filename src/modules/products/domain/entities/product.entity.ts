import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

export class ProductEntity implements Product {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    inventory_id: string;

    @ApiProperty({ example: 'Cloro' })
    name: string;
    
    @ApiProperty({ example: 5 })
    stock: number;

    @ApiProperty({ example: 105.00 })
    price: number;

    @ApiProperty({ example: '1 galón' })
    unit_measure: string;

    @ApiProperty({ example: 'Limpieza' })
    category_name: string;
    
    @ApiProperty({ type: Date, format: 'date', readOnly: true })
    created_at: Date;

    @ApiProperty({ type: Date, format: 'date' })
    expiration: Date;
}