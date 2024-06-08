import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateInventoryDto {
    @ApiProperty({ format: 'uuid' })
    @IsNotEmpty()
    @IsString()
    customer_id: string;

    @ApiProperty({ example: 'Ferreteria', description: 'Financial capital' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    company_name: string;

    @ApiProperty({ example: 30000.00, description: 'Financial capital' })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    capital: number;

    @ApiProperty({ example: 5000.0, description: 'The amount they have to pay you' })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    service_charge: number;
}