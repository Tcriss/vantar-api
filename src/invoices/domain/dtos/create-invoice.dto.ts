import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateProductListDto } from "../../../products/domain/dtos";

export class CreateInvoiceDto {
    @ApiProperty({ type: CreateProductListDto, isArray: true })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductListDto)
    products: CreateProductListDto[];

    @ApiProperty({ type: 'uuid' })
    @IsNotEmpty()
    shop_id: string;
};