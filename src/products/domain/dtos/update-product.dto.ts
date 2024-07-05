import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsOptional()
    price?: number;
}