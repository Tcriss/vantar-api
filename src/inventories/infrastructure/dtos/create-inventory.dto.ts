import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateInventoryDto {
    @ApiProperty({ format: 'uuid' })
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @ApiProperty({ example: 3000.00 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    cost: number;

    @ApiProperty({ example: 3000.00 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    subtotal: number;

    @ApiProperty({ example: 6000.0 })
    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    total: number;
}