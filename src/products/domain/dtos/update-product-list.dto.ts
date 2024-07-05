import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductListDto {
    @ApiProperty({ example: 'Cloro' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 80.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    unit_price?: number;

    @ApiProperty({ example: 3 })
    @IsOptional()
    @IsNumber()
    amount?: number;
}