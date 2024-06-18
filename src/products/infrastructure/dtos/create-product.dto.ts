import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsNotEmpty()
    price: number;
}