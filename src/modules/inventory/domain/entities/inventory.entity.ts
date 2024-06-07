import { ApiProperty } from "@nestjs/swagger";
import { Inventory } from "@prisma/client";

export class InventoryEntity implements Inventory {
    @ApiProperty({ format: 'uuid' })
    id: string;

    @ApiProperty({ format: 'uuid' })
    customer_id: string;

    @ApiProperty()
    products_amount: number;

    @ApiProperty()
    capital: number;

    @ApiProperty()
    company_name: string;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    service_charge: number;
}