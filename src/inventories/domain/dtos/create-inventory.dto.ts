import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { CreateProductListDto } from "@products/domain/dtos";

export class CreateInventoryDto {
    @ApiProperty({ example: 3000.00 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    cost: number;

    @ApiProperty({ type: CreateProductListDto, isArray: true })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductListDto)
    products: CreateProductListDto[];
}