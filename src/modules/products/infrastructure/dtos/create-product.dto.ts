import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID, Max } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    @IsNotEmpty()
    inventory_id: string;

    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 3 })
    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ example: '1 litro' })
    @IsString()
    @IsNotEmpty()
    unit_measure: string;

    @ApiProperty({ example: 'Limpieza' })
    @IsString()
    @IsNotEmpty()
    category_name: string;

    @ApiProperty({ format: 'date' })
    @IsDate()
    @IsNotEmpty()
    expiration: Date;
}