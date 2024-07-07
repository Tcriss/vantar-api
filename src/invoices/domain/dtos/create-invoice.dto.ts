import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";

import { CreateProductListDto } from "../../../products/domain/dtos";
import { Type } from "class-transformer";

export class CreateInvoiceDto {
    @ApiProperty({ type: CreateProductListDto, isArray: true })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductListDto)
    products: CreateProductListDto[];
};