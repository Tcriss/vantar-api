import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsString, MaxLength } from "class-validator";

import { CreateInventoryDto } from "./create-inventory.dto";

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    @ApiProperty({ example: 'Ferreteria', description: 'Financial capital' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    company_name?: string;

    @ApiProperty({ example: 30000.00, description: 'Financial capital' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    capital?: number;

    @ApiProperty({ example: 5000.0, description: 'The amount they have to pay you' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    service_charge?: number;
}