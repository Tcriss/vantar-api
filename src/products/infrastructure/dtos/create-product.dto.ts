import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsNotEmpty()
    price: number;
}