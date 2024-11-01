import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUUID, Matches } from "class-validator";

import { nameRegex } from "../../../security/application/constants";

export class CreateProductDto {
    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    @IsNotEmpty()
    shop_id: string;
}