import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsNumber } from "class-validator";

import { CreateInventoryDto } from "./create-inventory.dto";

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    @ApiProperty({ example: 30000.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    cost?: number;

    @ApiProperty({ example: 30000.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    total?: number;

    @ApiProperty({ example: 6000.0 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    subtotal?: number;
}