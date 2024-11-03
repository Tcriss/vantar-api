import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, ValidateNested, IsArray, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

import { UpdateProductListDto } from "@products/domain/dtos";

export class UpdateInventoryDto {
    @ApiProperty({ example: 30000.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    cost?: number;
    
    @ApiProperty({ type: UpdateProductListDto, isArray: true })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductListDto)
    products?: UpdateProductListDto[];
}