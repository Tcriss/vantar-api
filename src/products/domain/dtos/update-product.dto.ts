import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Matches } from "class-validator";

import { nameRegex } from "../../../security/application/constants";

export class UpdateProductDto {
    @ApiProperty({ example: 'Suavizante' })
    @IsString()
    @Matches(nameRegex, '', { message: 'name must not contain numbers' })
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 75.00 })
    @IsNumber()
    @IsOptional()
    price?: number;
}