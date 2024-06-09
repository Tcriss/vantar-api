import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @Max(30)
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 3 })
    @IsNumber()
    @IsOptional()
    stock?: number;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsOptional()
    price?: number;

    @ApiProperty({ example: '1 litro' })
    @Max(100)
    @IsString()
    @IsOptional()
    unit_measure?: string;

    @ApiProperty({ example: 'Limpieza' })
    @IsString()
    @IsOptional()
    category_name?: string;

    @ApiProperty({ format: 'date' })
    @IsDate()
    @IsOptional()
    expiration?: Date;
}