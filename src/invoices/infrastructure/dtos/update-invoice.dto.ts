import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";

import { UpdateProductListDto } from "./update-product-list.dto";
import { Type } from "class-transformer";

export class UpdateInvoiceDto {
    @ApiProperty({ type: UpdateProductListDto, isArray: true })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductListDto)
    products: UpdateProductListDto[];
}