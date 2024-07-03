import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

import { ProductList } from "../../../products/domain/entities/product-list.entity";

export class UpdateInvoiceDto {
    @ApiProperty({ example: '2240.00' })
    @IsOptional()
    @IsNumber()
    total?: number;

    @ApiProperty({ required: false, isArray: true })
    @IsOptional()
    products?: ProductList[];
}